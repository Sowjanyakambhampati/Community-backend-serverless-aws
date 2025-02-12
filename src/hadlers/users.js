exports.getUsers = async (event) => {
    try {
        const [rows] = await db.query("SELECT * FROM users");
        return {
            statusCode: 200,
            body: JSON.stringify(rows),
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};

exports.createUser = async (event) => {
    const { username, email, password } = JSON.parse(event.body);
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [result] = await db.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword]);
        
        await dynamoDB.put({
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
                id: result.insertId.toString(),
                username,
                email,
            },
        }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "User created successfully", id: result.insertId }),
        };
    } catch (error) {
        console.error("Error creating user:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not create user" }),
        };
    }
};

exports.updateUser = async (event) => {
    const { id } = event.pathParameters;
    const { username, email } = JSON.parse(event.body);

    try {
        await db.execute("UPDATE users SET username = ?, email = ? WHERE id = ?", [username, email, id]);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "User updated successfully" }),
        };
    } catch (error) {
        console.error("Error updating user:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not update user" }),
        };
    }
};

exports.deleteUser = async (event) => {
    const { id } = event.pathParameters;

    try {
        await db.execute("DELETE FROM users WHERE id = ?", [id]);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "User deleted successfully" }),
        };
    } catch (error) {
        console.error("Error deleting user:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not delete user" }),
        };
    }
};