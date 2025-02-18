const mysql = require("mysql2/promise");
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Events
exports.getEvents = async (event) => {
    try {
        const [rows] = await db.query("SELECT * FROM events");
        return {
            statusCode: 200,
            body: JSON.stringify(rows),
        };
    } catch (error) {
        console.error("Error fetching events:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};

exports.createEvent = async (event) => {
    const { name, location, date } = JSON.parse(event.body);

    try {
        const [result] = await db.execute("INSERT INTO events (name, location, date) VALUES (?, ?, ?)", [name, location, date]);
        
        await dynamoDB.put({
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
                id: result.insertId.toString(),
                name,
                location,
                date,
            },
        }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Event created successfully", id: result.insertId }),
        };
    } catch (error) {
        console.error("Error creating event:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not create event" }),
        };
    }
};

exports.updateEvent = async (event) => {
    const { id } = event.pathParameters;
    const { name, location, date } = JSON.parse(event.body);

    try {
        await db.execute("UPDATE events SET name = ?, location = ?, date = ? WHERE id = ?", [name, location, date, id]);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Event updated successfully" }),
        };
    } catch (error) {
        console.error("Error updating event:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not update event" }),
        };
    }
};

exports.deleteEvent = async (event) => {
    const { id } = event.pathParameters;

    try {
        await db.execute("DELETE FROM events WHERE id = ?", [id]);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Event deleted successfully" }),
        };
    } catch (error) {
        console.error("Error deleting event:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not delete event" }),
        };
    }
};
