#!/usr/bin/env python3
"""
Generate search index JSON from markdown documentation files
"""

import os
import json
import re
from pathlib import Path

# Base paths
DOCS_DIR = Path(__file__).parent.parent / 'docs'
BASEURL = '/Salesforce-GitHub-Test'

def extract_frontmatter_and_content(file_path):
    """Extract YAML frontmatter and markdown content from a file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for frontmatter
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter = parts[1].strip()
            markdown_content = parts[2].strip()
            
            # Extract title from frontmatter
            title_match = re.search(r'^title:\s*(.+)$', frontmatter, re.MULTILINE)
            title = title_match.group(1).strip() if title_match else None
            
            return title, markdown_content
    
    return None, content

def clean_markdown(text):
    """Remove markdown formatting and clean text for indexing"""
    # Remove code blocks
    text = re.sub(r'```[\s\S]*?```', '', text)
    text = re.sub(r'`[^`]+`', '', text)
    
    # Remove links but keep text
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    
    # Remove images
    text = re.sub(r'!\[([^\]]*)\]\([^\)]+\)', '', text)
    
    # Remove markdown headers
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    
    # Remove bold/italic
    text = re.sub(r'[*_]{1,2}([^*_]+)[*_]{1,2}', r'\1', text)
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    
    # Clean up whitespace
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()

def generate_search_index():
    """Generate search index from all markdown files"""
    search_index = []
    
    # Find all markdown files in docs directory
    for md_file in DOCS_DIR.rglob('*.md'):
        # Skip README files
        if md_file.name == 'README.md':
            continue
        
        # Get relative path
        rel_path = md_file.relative_to(DOCS_DIR)
        
        # Convert .md to .html for URL
        url_path = str(rel_path).replace('.md', '.html')
        if url_path == 'index.html':
            url_path = ''
        
        url = f"{BASEURL}/{url_path}".replace('//', '/')
        
        # Extract content
        title, content = extract_frontmatter_and_content(md_file)
        
        # Use filename as fallback title
        if not title:
            title = md_file.stem.replace('-', ' ').replace('_', ' ').title()
        
        # Clean content for indexing
        clean_content = clean_markdown(content)
        
        # Add to index
        if clean_content:  # Only add if there's actual content
            search_index.append({
                'title': title,
                'url': url,
                'content': clean_content[:500]  # Limit content length
            })
    
    return search_index

def main():
    """Main function"""
    print("Generating search index...")
    
    # Generate index
    search_index = generate_search_index()
    
    # Save to JSON file
    output_file = DOCS_DIR / 'search-index.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(search_index, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Generated search index with {len(search_index)} documents")
    print(f"✓ Saved to {output_file}")

if __name__ == '__main__':
    main()
