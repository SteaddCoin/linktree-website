package http

import (
	"backend/entities"
	"context"
	"crypto/sha256"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetUserBy(key string, value interface{}, users *mongo.Collection) (*entities.User, error) {
	s := users.FindOne(context.Background(), bson.M{key: value})
	if s.Err() != nil {
		return nil, s.Err()
	}

	var decoded = entities.User{}
	err := s.Decode(&decoded)
	if err != nil {
		return nil, err
	}

	return &decoded, nil
}

func HashPassword(password string) string {
	return fmt.Sprintf("%x", sha256.Sum256([]byte(password)))
}

func GenerateJWT(username, userID, role string) (string, error) {
	var mySigningKey = []byte(secretKey)
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)

	claims["username"] = username
	claims["userID"] = userID
	claims["role"] = role
	claims["exp"] = time.Now().Add(time.Minute * 30).Unix()

	tokenString, err := token.SignedString(mySigningKey)

	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func login(c *gin.Context) {
	var user = &entities.User{}
	err := c.BindJSON(user)
	if err != nil {
		c.JSON(400, gin.H{"message": "Bad Request"})
		return
	}

	existentUser, err := GetUserBy("username", user.Username, dbCollections.Users)
	if err != nil {
		c.JSON(400, gin.H{"message": "Wrong credential"})
		return
	}

	if HashPassword(user.Password) != existentUser.Password {
		c.JSON(400, gin.H{"message": "Wrong credential"})
		return
	}

	if !existentUser.Active {
		c.JSON(400, gin.H{"message": "Not activated"})
		return
	}

	token, err := GenerateJWT(existentUser.Username, existentUser.ID.Hex(), fmt.Sprintf("%d", existentUser.Permissions))
	if err != nil {
		fmt.Println(err)
		c.JSON(500, gin.H{"message": "Internal Server Error"})
		return
	}

	c.JSON(200, gin.H{
		"token": token,
	})
}
