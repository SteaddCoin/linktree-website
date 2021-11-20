package http

import (
	"backend/entities"
	"context"
	"encoding/json"
	"path/filepath"
	"net/http"
	"fmt"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func getMultiSectionItem(c *gin.Context) {
	username := c.Param("username")
	user, err := GetUserBy("username", username, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	r, err := dbCollections.MultiSectionItem.Find(context.Background(), bson.M{"userid": user.ID})
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	var multiSectionIcon = []entities.MultiSectionItem{}
	if err := r.All(context.Background(), &multiSectionIcon); err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	c.JSON(200, multiSectionIcon)
}

func createMultiSectionItem(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	title := c.PostForm("title")
	content := c.PostForm("content")
	tab := c.PostForm("tab")
	btnLink := c.PostForm("button_link")
	file, err := c.FormFile("image")
	if err != nil {
		if err == http.ErrMissingFile {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}
	}

	var tabStruct = entities.Tab{}
	err = json.Unmarshal([]byte(tab), &tabStruct)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var btnLinkStruct = entities.Link{}
	err = json.Unmarshal([]byte(btnLink), &btnLinkStruct)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var idImage = primitive.NewObjectID().Hex()
	var imagePath string

	imagePath = fmt.Sprintf("media/%s%s", idImage, filepath.Ext(file.Filename))

	err = c.SaveUploadedFile(file, imagePath)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var multiSectionItem = entities.MultiSectionItem{
		ID:         primitive.NewObjectID(),
		UserID:		objectID,
		Title:      title,
		Content:    content,
		Tab:        tabStruct,
		ButtonLink: btnLinkStruct,	
		ImagePath: fmt.Sprintf("/%s", imagePath),
	}

	_, err = dbCollections.MultiSectionItem.InsertOne(context.Background(), multiSectionItem)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	c.JSON(201, gin.H{})
	return
}

func updateMultiSectionItem(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	userID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	title := c.PostForm("title")
	content := c.PostForm("content")
	tab := c.PostForm("tab")
	btnLink := c.PostForm("button_link")
	file, err := c.FormFile("image")
	var img bool = true
	if err != nil {
		if err != http.ErrMissingFile {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}
		img = false
	}

	var tabStruct = entities.Tab{}
	err = json.Unmarshal([]byte(tab), &tabStruct)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var btnLinkStruct = entities.Link{}
	err = json.Unmarshal([]byte(btnLink), &btnLinkStruct)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var multiSectionItem = entities.MultiSectionItem{
		ID:         primitive.NewObjectID(),
		UserID:		userID,
		Title:      title,
		Content:    content,
		Tab:        tabStruct,
		ButtonLink: btnLinkStruct,	
	}
	

	if img{
		var idImage = primitive.NewObjectID().Hex()
		var imagePath string

		imagePath = fmt.Sprintf("media/%s%s", idImage, filepath.Ext(file.Filename))

		err = c.SaveUploadedFile(file, imagePath)
		if err != nil {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}

		multiSectionItem.ImagePath = fmt.Sprintf("/%s", imagePath)
		
		_, err = dbCollections.MultiSectionItem.UpdateOne(context.Background(), bson.M{"_id": bson.M{"$eq": objID}, "userid": bson.M{"$eq": userID}}, bson.M{"$set": bson.M{"title": multiSectionItem.Title, "content": multiSectionItem.Content, "tab": multiSectionItem.Tab, "buttonlink": multiSectionItem.ButtonLink, "imagepath": multiSectionItem.ImagePath}})
		if err != nil {
			c.JSON(500, gin.H{"message": "Internal Server Error"})
			return 
		}

		c.JSON(201, gin.H{})
		return
	}


	_, err = dbCollections.MultiSectionItem.UpdateOne(context.Background(), bson.M{"_id": bson.M{"$eq": objID}, "userid": bson.M{"$eq": userID}}, bson.M{"$set": bson.M{"title": multiSectionItem.Title, "content": multiSectionItem.Content, "tab": multiSectionItem.Tab, "buttonlink": multiSectionItem.ButtonLink}})
	if err != nil {
		c.JSON(500, gin.H{"message": "Internal Server Error"})
		return 
	}

	c.JSON(201, gin.H{})
	return
}

func deleteMultiSectionItem(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	_, err = dbCollections.MultiSectionItem.DeleteOne(context.Background(), bson.M{"_id": objID})
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	c.JSON(204, gin.H{})
}

func getMultiSection(c *gin.Context) {
	username := c.Param("username")
	user, err := GetUserBy("username", username, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	r := dbCollections.MultiSection.FindOne(context.Background(), bson.M{"userid": user.ID})
	var data = &entities.MultiSections{}
	if err := r.Decode(&data); err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	c.JSON(200, data)
}

func createUpdateMultiSection(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var data = entities.MultiSections{}
	err = c.BindJSON(&data)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	data.UserID = objectID
	ctx := context.Background()

	s, err := checkExists(ctx, objectID, dbCollections.MultiSection)
	if err != nil {
		c.JSON(500, gin.H{"message": "Internal Server Error"})
		return
	}

	var old = entities.MultiSections{}
	err = s.Decode(&old)
	if err != nil {
		data.ID = primitive.NewObjectID()
		_, err = dbCollections.MultiSection.InsertOne(ctx, data)
		if err != nil {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}

		c.JSON(201, gin.H{})
		return
	}

	_, err = dbCollections.MultiSection.UpdateOne(ctx, bson.M{"_id": bson.M{"$eq": old.ID}, "userid": bson.M{"$eq": objectID}}, bson.M{"$set": bson.M{"title": data.Title, "content": data.Content}})
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}
	c.JSON(201, gin.H{})
	return
}
