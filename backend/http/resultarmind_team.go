package http

import (
	"backend/entities"
	"context"
	"net/http"
	"path/filepath"
	"fmt"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func getMembers(c *gin.Context) {
	username := c.Param("username")
	user, err := GetUserBy("username", username, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	r, err := dbCollections.Members.Find(context.Background(), bson.M{"userid": user.ID})
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	var members = []entities.Member{}
	if err := r.All(context.Background(), &members); err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	c.JSON(200, members)
}

func createMember(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	name := c.PostForm("name")
	function := c.PostForm("function")
	facebook := c.PostForm("facebook")
	twitter := c.PostForm("twitter")
	youtube := c.PostForm("youtube")
	instagram := c.PostForm("instagram")
	file, err := c.FormFile("image")

	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var idImage = primitive.NewObjectID().Hex()

	err = c.SaveUploadedFile(file, fmt.Sprintf("media/%s", idImage))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var member = entities.Member{
		ID:        primitive.NewObjectID(),
		UserID:	   objectID,
		Name:      name,
		Function:  function,
		Facebook:  facebook,
		Instagram: instagram,
		Youtube:   youtube,
		Twitter:   twitter,
		ImagePath: fmt.Sprintf("/media/%s", idImage),
	}

	_, err = dbCollections.Members.InsertOne(context.Background(), member)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	c.JSON(201, gin.H{})
	return
}

func updateMember(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}
	
	name := c.PostForm("name")
	function := c.PostForm("function")
	facebook := c.PostForm("facebook")
	twitter := c.PostForm("twitter")
	youtube := c.PostForm("youtube")
	instagram := c.PostForm("instagram")
	file, err := c.FormFile("image")
	var img bool = true
	if err != nil {
		if err != http.ErrMissingFile {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}
		img = false
	}

	var member = entities.Member{
		ID:        primitive.NewObjectID(),
		UserID:	   objectID,
		Name:      name,
		Function:  function,
		Facebook:  facebook,
		Instagram: instagram,
		Youtube:   youtube,
		Twitter:   twitter,
	}

	if img {
		var idImage = primitive.NewObjectID().Hex()
		var imagePath = fmt.Sprintf("media/%s%s", idImage, filepath.Ext(file.Filename))
		err = c.SaveUploadedFile(file, imagePath)
		if err != nil {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}

		member.ImagePath = fmt.Sprintf("/%s", imagePath)

		_, err = dbCollections.Members.UpdateOne(context.Background(), bson.M{"_id": bson.M{"$eq": objID}, "userid": bson.M{"$eq": objectID}}, bson.M{"$set": bson.M{"name": member.Name, "function": member.Function, "facebook": member.Facebook, "instagram": member.Instagram, "youtube": member.Youtube, "twitter": member.Twitter, "imagepath": member.ImagePath}})
		if err != nil {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}

		c.JSON(204, gin.H{})
		return
	}

	_, err = dbCollections.Members.UpdateOne(context.Background(), bson.M{"_id": bson.M{"$eq": objID}, "userid": bson.M{"$eq": objectID}}, bson.M{"$set": bson.M{"name": member.Name, "function": member.Function, "facebook": member.Facebook, "instagram": member.Instagram, "youtube": member.Youtube, "twitter": member.Twitter}})
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	c.JSON(204, gin.H{})
	return
}

func deleteMember(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	_, err = dbCollections.Members.DeleteOne(context.Background(), bson.M{"_id": bson.M{"$eq": objID}, "userid": bson.M{"$eq": objectID}})
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	c.JSON(204, gin.H{})
}

func getTeam(c *gin.Context) {
	username := c.Param("username")
	user, err := GetUserBy("username", username, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	r := dbCollections.Team.FindOne(context.Background(), bson.M{"userid": user.ID})
	var data = &entities.Team{}
	if err := r.Decode(&data); err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	c.JSON(200, data)
}

func createUpdateTeam(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var data = entities.Team{}
	err = c.BindJSON(&data)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	data.UserID = objectID
	ctx := context.Background()

	s, err := checkExists(ctx, objectID, dbCollections.Team)
	if err != nil {
		c.JSON(500, gin.H{"message": "Internal Server Error"})
		return
	}

	var old = entities.Team{}
	err = s.Decode(&old)
	if err != nil {
		data.ID = primitive.NewObjectID()
		_, err = dbCollections.Team.InsertOne(ctx, data)
		if err != nil {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}

		c.JSON(201, gin.H{})
		return
	}

	_, err = dbCollections.Team.UpdateOne(ctx, bson.M{"_id": bson.M{"$eq": old.ID}, "userid": bson.M{"$eq": objectID}}, bson.M{"$set": bson.M{"title": data.Title, "content": data.Content}})
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}
	c.JSON(201, gin.H{})
	return

}
