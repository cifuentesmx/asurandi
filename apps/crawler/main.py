from flask import Flask, request, jsonify
from scripts.example import run_example_crawl

app = Flask(__name__)

@app.route('/process', methods=['GET'])
async def process_request():
    """
    This endpoint receives a parameter named 'input' and calls my_function.
    It then returns the result as a JSON response.
    """
    input_param = request.args.get('input')

    if input_param is None:
        return jsonify({"error": "Missing input parameter"}), 400

    result = await run_example_crawl()
    return jsonify(result.html)

if __name__ == '__main__':
    app.run(debug=True, port=5000)