package db

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Db struct {
	Users            *mongo.Collection
	Data             *mongo.Collection
	Logo             *mongo.Collection
	Menu             *mongo.Collection
	Banner           *mongo.Collection
	Section          *mongo.Collection
	Card             *mongo.Collection
	AccessLink       *mongo.Collection
	MultiSection     *mongo.Collection
	MultiSectionItem *mongo.Collection
	Team             *mongo.Collection
	Members          *mongo.Collection
	Questions        *mongo.Collection
	Question         *mongo.Collection
	Footer           *mongo.Collection
}

func InitDB(url string) (*Db, error) {

	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(url))
	if err != nil {
		return nil, err
	}

	var db = client.Database("backend")

	users := db.Collection("user")
	data := db.Collection("data")
	logo := db.Collection("logo")
	menu := db.Collection("menu")
	banner := db.Collection("banner")
	section := db.Collection("section")
	card := db.Collection("card")
	multiSection := db.Collection("multi_section")
	multiSectionItem := db.Collection("multi_section_item")
	accessLink := db.Collection("accessLink")
	team := db.Collection("team")
	member := db.Collection("member")
	questions := db.Collection("questions")
	question := db.Collection("question")
	footer := db.Collection("footer")

	return &Db{Users: users, Data: data, Logo: logo, Menu: menu, Section: section, Card: card, Banner: banner, MultiSection: multiSection, MultiSectionItem: multiSectionItem, AccessLink: accessLink, Team: team, Members: member, Questions: questions, Question: question, Footer: footer}, nil
}
