package http

import (
	"backend/entities"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func getSection(c *gin.Context) {
	username := c.Param("username")
	user, err := GetUserBy("username", username, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	r := dbCollections.Section.FindOne(context.Background(), bson.M{"userid": user.ID})
	var data = &entities.Section{}
	if err := r.Decode(&data); err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	c.JSON(200, data)
}

func createUpdateSection(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	title := c.PostForm("title")
	content := c.PostForm("content")
	btn := c.PostForm("btn")
	image, err := c.FormFile("image")

	if err != nil {
		if err != http.ErrMissingFile {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}
	}

	var idImage string = primitive.NewObjectID().Hex()

	var imagePath = fmt.Sprintf("media/%s%s", idImage, filepath.Ext(image.Filename))
	err = c.SaveUploadedFile(image, imagePath)
	if err != nil {
		c.JSON(500, gin.H{"message": "Internal Server Error"})
		return
	}

	var btnLink entities.Link
	err = json.Unmarshal([]byte(btn), &btnLink)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var data = entities.Section{
		UserID:		objectID,
		Title:      title,
		Content:    content,
		ImagePath:  "/" + imagePath,
		ButtonLink: btnLink,
	}

	ctx := context.Background()

	s, err := checkExists(ctx, objectID, dbCollections.Section)
	if err != nil {
		c.JSON(500, gin.H{"message": "Internal Server Error"})
		return
	}

	var old = entities.Section{}
	err = s.Decode(&old)
	if err != nil {
		data.ID = primitive.NewObjectID()
		_, err = dbCollections.Section.InsertOne(ctx, data)
		if err != nil {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}

		c.JSON(201, gin.H{})
		return
	}

	if image != nil {
		_, err = dbCollections.Section.UpdateOne(ctx, bson.M{"_id": bson.M{"$eq": old.ID}, "userid": bson.M{"$eq": objectID}}, bson.M{"$set": bson.M{"title": data.Title, "content": data.Content, "imagepath": data.ImagePath, "buttonlink": data.ButtonLink}})
	} else {
		_, err = dbCollections.Section.UpdateOne(ctx, bson.M{"_id": bson.M{"$eq": old.ID}, "userid": bson.M{"$eq": objectID}}, bson.M{"$set": bson.M{"title": data.Title, "content": data.Content, "buttonlink": data.ButtonLink}})
	}

	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}
	c.JSON(201, gin.H{})
	return
}
