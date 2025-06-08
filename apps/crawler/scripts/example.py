from crawl4ai import CrawlerRunConfig, CacheMode, BrowserConfig, DefaultMarkdownGenerator, PruningContentFilter, AsyncWebCrawler

async def run_example_crawl(url="https://anaseguros.com.mx/anaweb/index.html"):
    """
    Runs the WebCrawler on the specified URL and returns the extracted markdown content.
    """
    browser_config = BrowserConfig(
        headless=False
    )

    crawler_config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        excluded_tags=["nav", "footer", "aside"],
        remove_overlay_elements=True,
        markdown_generator=DefaultMarkdownGenerator(
            content_filter=PruningContentFilter(
                threshold=0.48, threshold_type="fixed", min_word_threshold=0
            ),
            options={"ignore_links": True},
        ),
    )
    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(
            url=url, config=crawler_config  
        )
        print(result.markdown[:500])
        return result
