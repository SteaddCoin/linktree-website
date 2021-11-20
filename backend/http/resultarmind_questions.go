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

func getQuestions(c *gin.Context) {
	username := c.Param("username")
	user, err := GetUserBy("username", username, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	r := dbCollections.Questions.FindOne(context.Background(), bson.M{"userid": user.ID})
	var data = &entities.Questions{}
	if err := r.Decode(&data); err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	c.JSON(200, data)
}

func createUpdateQuestions(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var data = entities.Questions{}
	err = c.BindJSON(&data)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	data.UserID = objectID
	ctx := context.Background()

	s, err := checkExists(ctx, objectID, dbCollections.Questions)
	if err != nil {
		c.JSON(500, gin.H{"message": "Internal Server Error"})
		return
	}

	var old = entities.Questions{}
	err = s.Decode(&old)
	if err != nil {
		data.ID = primitive.NewObjectID()
		_, err = dbCollections.Questions.InsertOne(ctx, data)
		if err != nil {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}

		c.JSON(201, gin.H{})
		return
	}

	_, err = dbCollections.Questions.UpdateOne(ctx, bson.M{"_id": bson.M{"$eq": old.ID}, "userid": bson.M{"$eq": objectID}}, bson.M{"$set": bson.M{"title": data.Title, "content": data.Content}})
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}
	c.JSON(201, gin.H{})
	return
}

func getQuestion(c *gin.Context) {
	username := c.Param("username")
	user, err := GetUserBy("username", username, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	r, err := dbCollections.Question.Find(context.Background(), bson.M{"userid": user.ID})
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	var question = []entities.Question{}
	if err := r.All(context.Background(), &question); err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	c.JSON(200, question)
}

func createQuestion(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	question := c.PostForm("question")
	answer := c.PostForm("answer")
	file, err := c.FormFile("image")

	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var idImage string = primitive.NewObjectID().Hex()

	err = c.SaveUploadedFile(file, fmt.Sprintf("media/%s", idImage))
	if err != nil {
		fmt.Println("Here?2")
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var questionStruct = entities.Question{
		ID:        primitive.NewObjectID(),
		UserID: objectID,
		Question:  question,
		Answer:    answer,
		ImagePath: fmt.Sprintf("/media/%s", idImage),
	}

	_, err = dbCollections.Question.InsertOne(context.Background(), questionStruct)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	c.JSON(201, gin.H{})
	return
}

func updateQuestion(c *gin.Context) {
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

	question := c.PostForm("question")
	answer := c.PostForm("answer")
	file, err := c.FormFile("image")
	var img bool = true
	if err != nil {
		if err != http.ErrMissingFile {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}
		img = false
	}

	var questionStruct = entities.Question{
		UserID:	   objectID,
		Question:  question,
		Answer:    answer,
	}
	
	if img {
		var idImage = primitive.NewObjectID().Hex()
		var imagePath string

		imagePath = fmt.Sprintf("media/%s%s", idImage, filepath.Ext(file.Filename))

		err = c.SaveUploadedFile(file, imagePath)
		if err != nil {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}

		questionStruct.ImagePath = fmt.Sprintf("/%s", imagePath)
	
		_, err = dbCollections.Question.UpdateOne(context.Background(), bson.M{
			"_id": bson.M{"$eq": objID},
			"userid": bson.M{"$eq": objectID},
		}, bson.M{"$set": bson.M{"question": questionStruct.Question, "answer": questionStruct.Answer, "imagepath": questionStruct.ImagePath}})
		if err != nil {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}

		c.JSON(201, gin.H{})
		return
	}
	
	_, err = dbCollections.Question.UpdateOne(context.Background(), bson.M{
		"_id": bson.M{"$eq": objID},
		"userid": bson.M{"$eq": objectID},
	}, bson.M{"$set": bson.M{"question": questionStruct.Question, "answer": questionStruct.Answer}})
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	c.JSON(201, gin.H{})

}

func deleteQuestion(c *gin.Context) {
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

	_, err = dbCollections.Question.DeleteOne(context.Background(), bson.M{"_id": objID, "userid": objectID})
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	c.JSON(204, gin.H{})
}
