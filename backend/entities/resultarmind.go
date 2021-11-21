package entities

import "go.mongodb.org/mongo-driver/bson/primitive"

type Menu struct {
	ID     primitive.ObjectID `json:"id" bson:"_id"`
	UserID primitive.ObjectID `json:"user_id"`
	Links  Links              `json:"links"`
}

type Banner struct {
	ID      primitive.ObjectID `json:"id" bson:"_id"`
	UserID  primitive.ObjectID `json:"user_id"`
	Title   string             `json:"title"`
	Content string             `json:"content"`
	Youtube string             `json:"youtube"`
}

type Cards struct {
	ID      primitive.ObjectID `json:"id" bson:"_id"`
	UserID  primitive.ObjectID `json:"user_id"`
	Title   string             `json:"title"`
	Content string             `json:"content"`
	Cards   []Card             `json:"cards"`
}

type Card struct {
	ID        primitive.ObjectID `json:"id" bson:"_id"`
	Title     string             `json:"title"`
	Content   string             `json:"content"`
	IconClass string             `json:"icon_class"`
}

type Section struct {
	ID         primitive.ObjectID `json:"id" bson:"_id"`
	UserID     primitive.ObjectID `json:"user_id"`
	Title      string             `json:"title"`
	Content    string             `json:"content"`
	ImagePath  string             `json:"image_path"`
	ButtonLink Link               `json:"button_link"`
}

type AccessLink struct {
	ID     primitive.ObjectID `json:"id" bson:"_id"`
	UserID primitive.ObjectID `json:"user_id"`
	Link   Link               `json:"link"`
}

type MultiSections struct {
	ID      primitive.ObjectID `json:"id" bson:"_id"`
	UserID  primitive.ObjectID `json:"user_id"`
	Title   string             `json:"title"`
	Content string             `json:"content"`
}

type Tab struct {
	Icon string `json:"icon"`
	Name string `json:"name"`
}

type MultiSectionItem struct {
	ID         primitive.ObjectID `json:"id" bson:"_id"`
	UserID     primitive.ObjectID `json:"user_id"`
	Tab        Tab                `json:"tab"`
	Title      string             `json:"title"`
	Content    string             `json:"content"`
	ImagePath  string             `json:"image_path"`
	ButtonLink Link               `json:"button_link"`
}

type Team struct {
	ID      primitive.ObjectID `json:"id" bson:"_id"`
	UserID  primitive.ObjectID `json:"user_id"`
	Title   string             `json:"title"`
	Content string             `json:"content"`
}

type Member struct {
	ID        primitive.ObjectID `json:"id" bson:"_id"`
	UserID    primitive.ObjectID `json:"user_id"`
	ImagePath string             `json:"image_path"`
	Name      string             `json:"name"`
	Function  string             `json:"function"`
	Facebook  string             `json:"facebook"`
	Youtube   string             `json:"youtube"`
	Twitter   string             `json:"twitter"`
	Instagram string             `json:"instagram"`
}

type Questions struct {
	ID      primitive.ObjectID `json:"id" bson:"_id"`
	UserID  primitive.ObjectID `json:"user_id"`
	Title   string             `json:"title"`
	Content string             `json:"content"`
}

type Question struct {
	ID        primitive.ObjectID `json:"id" bson:"_id"`
	UserID    primitive.ObjectID `json:"user_id"`
	Question  string             `json:"question"`
	Answer    string             `json:"answer"`
	ImagePath string             `json:"image_path"`
}

type Contact struct {
	ID     primitive.ObjectID `json:"id" bson:"_id"`
	UserID primitive.ObjectID `json:"user_id"`
	Number string             `json:"number"`
}

type Footer struct {
	ID          primitive.ObjectID `json:"id" bson:"_id"`
	UserID      primitive.ObjectID `json:"user_id"`
	Street      string             `json:"street" bson:"street"`
	PhoneNumber string             `json:"phone_number" bson:"phone_number"`
	Contact     string             `json:"contact" bson:"contact"`
	SocialMedia []Link             `json:"social_media" bson:"social_media"`
}
