Community Forum Backend - Serverless

This project is a serverless backend for a community forum, built with AWS Lambda, API Gateway, MySQL (RDS), DynamoDB, Cognito for authentication, and S3 for file uploads.

Features

User Authentication (Register/Login using Cognito and JWT)

CRUD Operations for Posts, Events, Products, and Users

File Uploads to S3

MySQL Database on AWS RDS

DynamoDB Caching for frequently accessed data

API Gateway for Routing

Serverless Framework for easy deployment

Prerequisites

Node.js (v18.x or later)

AWS CLI (Configured with valid credentials)

Serverless Framework (npm install -g serverless)

Installation

Clone the repository:

git clone https://github.com/your-repo/community-forum-backend.git
cd community-forum-backend

Install dependencies:
npm install

Deployment

Deploy the service using:

serverless deploy

Running Locally

To test the service locally:
serverless offline

Technologies Used

AWS Lambda (Serverless compute)

AWS API Gateway (Routing and request handling)

AWS RDS (MySQL) (Primary database for structured data)

AWS DynamoDB (Caching frequently accessed data)

AWS Cognito (Authentication and user management)

AWS S3 (File storage)

Node.js with Express-like routing in Serverless framework

API Endpoints

Method

Endpoint

Description

POST

/auth/register

Register a new user

POST

/auth/login

Login and get JWT

POST

/posts

Create a new post

GET

/posts/{id}

Get a post by ID

PUT

/posts/{id}

Update a post

DELETE

/posts/{id}

Delete a post

POST

/upload

Upload a file to S3

