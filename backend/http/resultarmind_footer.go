package http

import (
	"backend/entities"
	"context"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func getFooter(c *gin.Context) {
	username := c.Param("username")
	user, err := GetUserBy("username", username, dbCollections.Users)
	if err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	r := dbCollections.Footer.FindOne(context.Background(), bson.M{"userid": user.ID})
	var data = &entities.Footer{}
	if err := r.Decode(&data); err != nil {
		c.JSON(404, gin.H{"message": "Not Found"})
		return
	}

	c.JSON(200, data)
}

func createUpdateFooter(c *gin.Context) {
	objectID, err := objectIDFromToken(c.GetHeader("jwt-token"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	var data = entities.Footer{}
	err = c.BindJSON(&data)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	data.UserID = objectID
	ctx := context.Background()

	s, err := checkExists(ctx, objectID, dbCollections.Footer)
	if err != nil {
		c.JSON(500, gin.H{"message": "Internal Server Error"})
		return
	}

	var old = entities.Footer{}
	err = s.Decode(&old)
	if err != nil {
		data.ID = primitive.NewObjectID()
		_, err = dbCollections.Footer.InsertOne(ctx, data)
		if err != nil {
			c.JSON(400, gin.H{"message": "Bad Request"})
			return
		}

		c.JSON(201, gin.H{})
		return
	}

	_, err = dbCollections.Footer.UpdateOne(ctx, 
		bson.M{
			"_id": bson.M{"$eq": old.ID}, 
			"userid": bson.M{"$eq": objectID},
		},
		bson.M{"$set": bson.M{
				"contact":      data.Contact,
				"phonenumber": data.PhoneNumber,
				"street":       data.Street,
				"socialmedia": data.SocialMedia,
			}})
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}
	c.JSON(201, gin.H{})
	return
}
