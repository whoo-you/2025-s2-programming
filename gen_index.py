import json
import pickle
from sentence_transformers import SentenceTransformer
from torch import cuda
import tqdm


def load_data(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: The file {filepath} does not exist.")
        return None
    except json.JSONDecodeError:
        print(f"Error: The file {filepath} is not a valid JSON file.")
        return None
    texts = [d["text"] for d in data.values()]

    return texts, data


def create_and_save_index(json_path, index_path):
    texts, data = load_data(json_path)
    if texts is None:
        print("No data.")
        return
    if cuda.is_available():
        device = "cuda"
    else:
        device = "cpu"
    model = SentenceTransformer("all-MiniLM-L12-v2", device=device)
    embeddings = model.encode(texts, show_progress_bar=True)
    index = {"embeddings": embeddings, "data": data}
    with open(index_path, "wb") as f:
        pickle.dump(index, f)


if __name__ == "__main__":
    json_path = "summary/python.json"
    index_path = "index.pkl"
    create_and_save_index(json_path, index_path)
    print(f"Index created and saved to {index_path}")
