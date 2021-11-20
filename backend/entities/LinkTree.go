package entities

import (
	"errors"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Data struct {
	ID      primitive.ObjectID `json:"id" bson:"_id" form:"id"`
	UserID  primitive.ObjectID `json:"user_id"`
	Title   Link               `json:"title"`
	Content string             `json:"content" form:"content"`
	Links   Links              `json:"links" form:"links"`
}

type Image struct {
	ID       primitive.ObjectID `json:"id" bson:"_id"`
	UserID   primitive.ObjectID `json:"user_id"`
	FilePath string             `json:"file_path"`
}

type Links []Link

type Link struct {
	Name string `json:"name"`
	Url  string `json:"url"`
}

func (d *Data) Validate() error {
	if d.Content == "" {
		return errors.New("Not valid")
	}

	if len(d.Links) == 0 {
		return errors.New("Not valid")
	}

	d.ID = primitive.NewObjectID()

	return nil
}
