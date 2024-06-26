require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
    window.editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: '## MarkdownをHTMLに変換します\nここにmarkdownを入力してください',
        language: 'markdown'
    });

    window.editor.onDidChangeModelContent(function() {
        let markdown = window.editor.getValue();
        const button = document.getElementById('html-button');
        if (button.textContent === 'HTML Code') {
            convertMarkdown(markdown, "preview");
        } else {
            convertMarkdown(markdown, "html");
        }
    });

    let markdown = window.editor.getValue();
    convertMarkdown(markdown, "preview");
});




document.getElementById('html-button').addEventListener('click', function() {
    toggleView();
}) 

document.getElementById('download-button').addEventListener('click', function() {
    let markdown = window.editor.getValue();
    convertMarkdown(markdown, "download");
}) 


function toggleView() {
    const button = document.getElementById('html-button');
    let markdown = window.editor.getValue();
    
    if (button.textContent === 'HTML Code') {
        button.textContent = 'Preview';
        convertMarkdown(markdown, 'html');
    } else {
        button.textContent = 'HTML Code';
        convertMarkdown(markdown, 'preview');
    }
}

function convertMarkdown(markdown, outputOption) {
    fetch('convert.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ markdown: markdown })
    })
    .then(response => response.json())
    .then(data => {
        if (outputOption === 'preview') {
            document.getElementById('output-container').innerHTML = data.html;
        } else if (outputOption === 'html') {
            document.getElementById('output-container').innerText = data.html;
        } else if (outputOption === 'download') {
            var link = document.createElement('a');
            link.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(data.html);
            link.download = 'converted.html';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    })
    .catch(error => console.error('Error:', error));
}
