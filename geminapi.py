import google.generativeai as genai
import requests
from bs4 import BeautifulSoup

# Set your Gemini API Key
API_KEY = "Environmental_var"
genai.configure(api_key=API_KEY)

# Initialize Gemini model
model = genai.GenerativeModel("gemini-pro")

# Function to fetch latest election news
def fetch_election_news():
    url = "https://news.google.com/search?q=election&hl=en&gl=US&ceid=US:en"  # Google News Search for "Election"
    headers = {"User-Agent": "Mozilla/5.0"}

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    news_list = []
    for article in soup.select("h3 a")[:5]:  # Fetch top 5 news headlines
        title = article.text
        link = "https://news.google.com" + article["href"][1:]
        news_list.append(f"{title} - {link}")

    return news_list

# Function to analyze news using Gemini
def analyze_election_news(news_list):
    prompt = "Summarize the following latest election news updates:\n\n" + "\n".join(news_list)
    response = model.generate_content(prompt)
    return response.text

# Fetch and analyze election updates
if __name__ == "__main__":
    news = fetch_election_news()
    
    if news:
        print("\nLatest Election News:\n", "\n".join(news))
        print("\nAnalyzing with Gemini AI...\n")
        summary = analyze_election_news(news)
        print("Gemini AI Summary:\n", summary)
    else:
        print("No latest election news found.")
