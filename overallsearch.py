import pickle
from sentence_transformers import SentenceTransformer,util

model = SentenceTransformer("all-MiniLM-L12-v2", device="cpu")

def search(query, top_n=5):
    try:
        with open("index.pkl", "rb") as f:
            index = pickle.load(f)
    except Exception:
        print("An error occurred while loading the index.")
        return {}

    embeddings = index["embeddings"]
    data = index["data"]

    query_vector = model.encode([query])
    similarities = util.cos_sim(query_vector, embeddings)
    top_results = similarities.topk(top_n)
    top_indices = top_results[1].tolist()
    print(f"Query: {query}")
    print(f"results: {top_indices}")
    result = [
        {
            "path": list(data.keys())[i],
            "title": data[list(data.keys())[i]]["title"],
            "content": data[list(data.keys())[i]]["text"][:500],
        }
        for i in top_indices[0]
    ]
    return result
