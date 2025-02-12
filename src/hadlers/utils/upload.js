const AWS = require("aws-sdk");
const S3 = new AWS.S3();

exports.uploadFile = async (event) => {
    const { fileName, fileContent } = JSON.parse(event.body);

    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: Buffer.from(fileContent, "base64"),
    };

    try {
        await S3.upload(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "File uploaded successfully", fileName }),
        };
    } catch (error) {
        console.error("Error uploading file:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "File upload failed" }),
        };
    }
};
