from bottle import run, route, static_file, template, request, response
from sentence_transformers import SentenceTransformer
from overallsearch import search
import json

model = SentenceTransformer("all-MiniLM-L12-v2", device="cpu")

@route("/")
def hello():
    return static_file("index.html", root="./static")


@route("/static/<filepath:path>")
def server_static(filepath):
    return static_file(filepath, root="./static/")


# @route("/documents/<filepath:path>")
# def server_documents(filepath):
#    return static_file(filepath, root="./documents/")


@route("/api/process", method="POST")
def process():
    try:
        data = request.json
        query = data.get("query")
        search_result = search(query)
        response.content_type = "application/json"
        print(json.dumps(search_result, ensure_ascii=False, indent=2))
        return json.dumps(search_result, ensure_ascii=False, indent=2)
    except Exception as e:
        response.status = 500
        return json.dumps({"error": str(e)})


if __name__ == "__main__":
    run(host="localhost", port=8080, debug=True, reloader=True)
