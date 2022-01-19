const Pay = () => {
    const sslData = {
        "user_id": "9",
        "token": "test_token",
        "payment_type": "sslcommerze",
        "grand_total": "1000",
        "shipping_cost": "30",
        "shipping_message": "This is a test shipping message",
        "address": "address",
        "city": "city",
        "postal_code": "1234",
        "country": "country",
        "cart": [
                    {
                        "seller_id": 10,
                        "product_id": 15,
                        "price": 12,
                        "quantity": 5
                    },
                    {
                        "seller_id": 20,
                        "product_id": 25,
                        "price": 12,
                        "quantity": 7
                    }
                ]
    }
    return (
        <>
            <div className="container">
                <form method="POST" className="needs-validation" noValidate>
                    <button className="btn btn-primary btn-lg btn-block" id="sslczPayBtn"
                            token="if you have any token validation"
                            postdata="your javascript arrays or objects which requires in backend"
                            order={JSON.stringify(sslData)}
                            endpoint={`${process.env.REACT_APP_SERVER_URL}pay-via-ajax`}> Pay Now
                    </button>
                </form>
            </div>
        </>
    )
}
export default Pay