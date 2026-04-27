function Products() {
  return (
    <div>
      <h1>Products</h1>
      <p className="text-muted mb-4">
        Welcome to the Product Management section. This module is designed to
        manage product information stored in the database through FastAPI APIs
        and display it dynamically within the application. All product records
        shown in this section are fetched securely from the database using
        protected backend endpoints. Access to product management is secured
        through AWS Cognito authentication, ensuring only authorized users can
        view and manage product data. This section allows administrators to view
        product listings, manage inventory details, update pricing, search
        products, apply pagination, and perform product-related operations
        efficiently. All product actions such as fetching, editing, updating and
        deleting are handled through FastAPI APIs with token-based
        authorization. Product information including product names, prices,
        categories, descriptions, stock availability and related details are
        retrieved from the database and rendered dynamically in the user
        interface. FastAPI processes requests, interacts with the database, and
        returns structured data for seamless product management. This product
        management module demonstrates secure authentication, backend API
        integration, database operations, and scalable full stack architecture
        following industry-standard practices.
      </p>
    </div>
  );
}

export default Products;
