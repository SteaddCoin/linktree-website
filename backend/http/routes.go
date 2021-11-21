package http

import (
	"backend/db"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	// "github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var secretKey = os.Getenv("secret-key")

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, jwt-token")
		c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func InitServer(port string, db *db.Db) {
	dbCollections = db

	r := gin.Default()

	r.Use(CORSMiddleware())
	// Access cors - All
	/*r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "jwt-token"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool{
			return true
		},
	}))
	*/
	r.GET("/read-logo/:username", getImage)

	// 5 Endpoints
	// Link tree
	r.GET("/read-linktree/:username", read)

	// Resultarmind
	r.GET("/read-menu/:username", getMenu)
	r.GET("/read-access-link/:username", getAccessLink)
	r.GET("/read-banner/:username", getBanner)
	r.GET("/read-section/:username", getSection)
	r.GET("/read-cards/:username", getCards)
	r.GET("/read-multi-sections/:username", getMultiSection)
	r.GET("/read-multi-sections-item/:username", getMultiSectionItem)
	//r.GET("/read-team", getTeam)
	r.GET("/read-members/:username", getMembers)
	r.GET("/read-team/:username", getTeam)
	r.GET("/read-questions/:username", getQuestions)
	r.GET("/read-question/:username", getQuestion)
	r.GET("/read-contact/:username", getContact)
	r.GET("/read-footer/:username", getFooter)

	r.GET("/test", func(c *gin.Context) {
		image, err := c.FormFile("image")
		if err != nil {
			if err == http.ErrMissingFile {
				fmt.Println(err)
				return
			}
		}

		fmt.Println(filepath.Ext(image.Filename))
		c.SaveUploadedFile(image, "media/test.png")
	})

	r.Static("/media", "media")

	r.POST("/login", login)
	r.POST("/register", register)

	routes := r.Group("/")
	routes.Use(Auth)
	{
		routes.GET("/verify", verify)
		routes.GET("/list-users", listUsers)
		routes.GET("/get-me", getMe)
		routes.GET("/is-admin", isAdmin)
		routes.POST("/update-user/:id", UpdateUserAsAdmin)
		routes.POST("/change-user", changeUser)
		routes.POST("/change-password/:username", changePassword)

		routes.POST("/create-logo", createImage)
		routes.POST("/create-linktree", createLinksData)
		routes.PUT("/update-linktree/:id", update)
		routes.DELETE("/delete-linktree/:id", delete)
		routes.DELETE("/delete-logo", deleteImage)

		// Resultarmind
		routes.POST("/create-menu", createUpdateMenu)
		routes.POST("/create-access-link", createUpdateAccessLink)
		routes.POST("/create-banner", createUpdateBanner)
		routes.POST("/create-section", createUpdateSection)
		routes.POST("/create-cards", createUpdateCards)
		routes.POST("/create-multi-sections", createUpdateMultiSection)
		routes.POST("/create-multi-sections-item", createMultiSectionItem)
		routes.POST("/update-multi-sections-item/:id", updateMultiSectionItem)
		routes.POST("/create-member", createMember)
		routes.POST("/update-member/:id", updateMember)
		routes.POST("/create-team", createUpdateTeam)
		routes.POST("/create-questions", createUpdateQuestions)
		routes.POST("/create-question", createQuestion)
		routes.POST("/update-question/:id", updateQuestion)
		routes.POST("/create-contact", createUpdateContact)
		routes.POST("/create-footer", createUpdateFooter)

		routes.DELETE("/delete-member/:id", deleteMember)
		routes.DELETE("/delete-multi-section-item/:id", deleteMultiSectionItem)
		routes.DELETE("/delete-question/:id", deleteQuestion)
	}

	r.Run(fmt.Sprintf(":%s", port))
}
