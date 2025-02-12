exports.getProducts = async (event) => {
    try {
        const [rows] = await db.query("SELECT * FROM products");
        return {
            statusCode: 200,
            body: JSON.stringify(rows),
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};

exports.createProduct = async (event) => {
    const { name, price, description } = JSON.parse(event.body);

    try {
        const [result] = await db.execute("INSERT INTO products (name, price, description) VALUES (?, ?, ?)", [name, price, description]);

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Product created successfully", id: result.insertId }),
        };
    } catch (error) {
        console.error("Error creating product:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not create product" }),
        };
    }
};

exports.updateProduct = async (event) => {
    const { id } = event.pathParameters;
    const { name, price, description } = JSON.parse(event.body);

    try {
        await db.execute("UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?", [name, price, description, id]);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Product updated successfully" }),
        };
    } catch (error) {
        console.error("Error updating product:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not update product" }),
        };
    }
};

exports.deleteProduct = async (event) => {
    const { id } = event.pathParameters;

    try {
        await db.execute("DELETE FROM products WHERE id = ?", [id]);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Product deleted successfully" }),
        };
    } catch (error) {
        console.error("Error deleting product:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not delete product" }),
        };
    }
};
