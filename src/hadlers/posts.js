const mysql = require("mysql2/promise");
const AWS = require("aws-sdk");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.getPosts = async (event) => {
    try {
        const [rows] = await db.query("SELECT * FROM posts");
        return {
            statusCode: 200,
            body: JSON.stringify(rows),
        };
    } catch (error) {
        console.error("Error fetching posts:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};

exports.createPost = async (event) => {
    const { title, content } = JSON.parse(event.body);

    try {
        const [result] = await db.execute("INSERT INTO posts (title, content) VALUES (?, ?)", [title, content]);
        
        // Store metadata in DynamoDB
        await dynamoDB.put({
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
                id: result.insertId.toString(),
                title,
                content,
            },
        }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Post created successfully", id: result.insertId }),
        };
    } catch (error) {
        console.error("Error creating post:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not create post" }),
        };
    }
};

exports.updatePost = async (event) => {
    const { id } = event.pathParameters;
    const { title, content } = JSON.parse(event.body);

    try {
        await db.execute("UPDATE posts SET title = ?, content = ? WHERE id = ?", [title, content, id]);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Post updated successfully" }),
        };
    } catch (error) {
        console.error("Error updating post:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not update post" }),
        };
    }
};

exports.deletePost = async (event) => {
    const { id } = event.pathParameters;

    try {
        await db.execute("DELETE FROM posts WHERE id = ?", [id]);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Post deleted successfully" }),
        };
    } catch (error) {
        console.error("Error deleting post:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not delete post" }),
        };
    }
};
