import zipfile
import xml.etree.ElementTree as ET
import sys

def get_docx_text(path):
    try:
        document = zipfile.ZipFile(path)
        xml_content = document.read('word/document.xml')
        tree = ET.XML(xml_content)
        WORDS_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
        texts = []
        for paragraph in tree.iter(WORDS_NAMESPACE + 'p'):
            para_texts = [node.text for node in paragraph.iter(WORDS_NAMESPACE + 't') if node.text]
            if para_texts:
                texts.append(''.join(para_texts))
        return '\n'.join(texts)
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    print(get_docx_text(sys.argv[1]))
