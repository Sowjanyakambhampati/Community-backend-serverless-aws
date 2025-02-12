exports.login = async (event) => {
    const { email, password } = JSON.parse(event.body);

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return { statusCode: 401, body: JSON.stringify({ error: "Invalid credentials" }) };
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { statusCode: 401, body: JSON.stringify({ error: "Invalid credentials" }) };
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return {
            statusCode: 200,
            body: JSON.stringify({ token, user: { id: user.id, username: user.username, email: user.email } }),
        };
    } catch (error) {
        console.error("Error logging in:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not login" }),
        };
    }
};