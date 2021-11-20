
## MongoDB

 - I'm running the mongodb in a docker container
 If you have docker, you can run it using the following command:
 ```bash
docker run -d --name <NAME> -p 27017:27017 mongo
 ```

 - Run the program 
 ```bash
go run cmd/main.go
 ```

 - Create admin account 
 ```bash
go run cmd/main.go username password
 ```

 - the secretKey on .env file is used to encrypt the jwtToken use to authenticate and authorize the user


 # Endpoints - Linktree
	- Ver /entities/linktree.go para perceber mais sobre os tipos de dados
	* /read-linktree - Read the data
	* /read-logo - Gives the file path the main image
	* /login - Give the jwt token if you pass the username and password
	* /media - serve the images folder
	* /create-logo - Upload the image
	* /create-linktree - Create a new data with content and list of links
	* /update-linktree/:id - update data
	* /delete-linktree/:id - delete the data
	* /delete-logo - delete the image

# Endpoints - ResultarMind
	- Ver /entities/resultarmind.go para perceber mais sobre os tipos de dados
	* /read-menu - Le os items do menu
	* /read-access-link - Button costumizado
	* /read-banner - Le os itens do banner
	* /read-section - Le os itens da section
	* /read-cards
	* /read-multi-sections
	* /read-multi-section-item
	* /read-members
	* /read-team
	* /read-questions
	* /read-question
	* /read-footer
	* /create-menu
	* /create-access-link
	* /create-banner
	* /create-section
	* /create-cards
	* /create-multi-sections
	* /create-multi-sections-item
	* /create-member
	* /create-team
	* /create-questions
	* /create-question
	* /create-footer
	* /delete-member/${id}
	* /delete-multi-section-item/${id}
	* /delete-question/${id}
