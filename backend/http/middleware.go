package http

import (
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func Auth(c *gin.Context) {
	headerToken := c.GetHeader("jwt-token")

	token, err := GetHeaderToken(headerToken)
	if err != nil {
		c.AbortWithStatusJSON(401, gin.H{
			"message": "Not Authorized",
		})
		return
	}

	jwtToken, err := ReceiveTokenFromJWT(token)

	if err != nil {
		c.AbortWithStatusJSON(401, gin.H{
			"message": "Not Authorized",
		})
		return
	}

	if !jwtToken.Valid {
		c.AbortWithStatusJSON(401, gin.H{
			"message": "Not Authorized",
		})
		return
	}

	c.Next()
}

func GetHeaderToken(header string) (string, error) {
	token := strings.Split(header, " ")
	if token[0] != "JWT" {
		return "", fmt.Errorf("JWT Not found")
	}

	return token[1], nil
}

func ReceiveTokenFromJWT(token string) (*jwt.Token, error) {
	return jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("There was an error in parsing")
		}
		return []byte(secretKey), nil
	})
}

func userIDFromToken(token *jwt.Token) (string, error) {
	jwt, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", fmt.Errorf("Not ok")
	}

	err := jwt.Valid()
	if err != nil {
		return "", err
	}

	return jwt["userID"].(string), nil
}

func verify(c *gin.Context) {
	c.JSON(200, gin.H{})
	return
}
