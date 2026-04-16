export const successMessage = (req, res) => {
    const { tx_ref } = req.params;
    
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Successful - ShopAlly</title>
            <style>
                body {
                    background-color: #f4f7f6;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .card {
                    background: white;
                    padding: 3rem;
                    border-radius: 20px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                    text-align: center;
                    max-width: 450px;
                    width: 90%;
                }
                .icon-circle {
                    width: 80px;
                    height: 80px;
                    background: #e6fcf5;
                    color: #0ca678;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 40px;
                    margin: 0 auto 1.5rem;
                }
                h1 {
                    color: #212529;
                    margin-bottom: 0.5rem;
                    font-size: 1.8rem;
                }
                p {
                    color: #868e96;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }
                .ref-badge {
                    background: #f8f9fa;
                    padding: 0.75rem;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 0.9rem;
                    color: #495057;
                    border: 1px solid #e9ecef;
                    display: block;
                    margin-bottom: 2rem;
                    word-break: break-all;
                }
                .btn {
                    display: inline-block;
                    background: #228be6;
                    color: white;
                    padding: 12px 30px;
                    text-decoration: none;
                    border-radius: 10px;
                    font-weight: 600;
                    transition: transform 0.2s, background 0.2s;
                }
                .btn:hover {
                    background: #1c7ed6;
                    transform: translateY(-2px);
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="icon-circle">✓</div>
                <h1>Payment Confirmed</h1>
                <p>Your order has been processed successfully. We've sent a confirmation email to your inbox.</p>
                
                <span class="ref-badge">${tx_ref}</span>
                
                <a href="http://localhost:5173/" class="btn">
                    Go to Dashboard
                </a>
            </div>
        </body>
        </html>
    `);
};