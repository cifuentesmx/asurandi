from crawl4ai import WebCrawler

def run_example_crawl(url="https://openai.com/api/pricing/"):
    """
    Runs the WebCrawler on the specified URL and returns the extracted markdown content.
    """
    crawler = WebCrawler()
    crawler.warmup()
    result = crawler.run(url=url)
    return result.markdown
