function renderSearchResults(results) {
    let output = '<div class="space-y-6">';
    console.log(Array.isArray(results), results);
    // resultsは配列形式 [{path, title, content}, ...]
    if (Array.isArray(results) && results.length > 0) {
        for (const item of results) {
            output += `
                <div
                    onclick="window.open('${item.path}', '_blank')"
                    class="result-card cursor-pointer bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300"
                >
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                <i class="fas fa-file-code text-white text-sm"></i>
                            </div>
                            <div>
                                <span class="result-title bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full transition-colors">${item.title}</span>
                            </div>
                        </div>
                        <i class="fas fa-external-link-alt text-gray-400 text-sm"></i>
                    </div>
                    <p class="text-gray-700 leading-relaxed line-clamp-3">${item.content}</p>
                    <div class="mt-4 pt-3 border-t border-gray-100">
                        <span class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            <i class="fas fa-link mr-1"></i>${item.path}
                        </span>
                    </div>
                </div>
            `;
        }
    } else {
        output += `
            <div class="text-center py-16">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <i class="fas fa-search text-gray-400 text-2xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">検索結果が見つかりませんでした</h3>
                <p class="text-gray-500 mb-6">別のキーワードで検索してみてください</p>
                <div class="space-x-2">
                    <button class="search-tip px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors">
                        numpy array
                    </button>
                    <button class="search-tip px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors">
                        pandas dataframe
                    </button>
                </div>
            </div>
        `;
    }

    output += '</div>';
    return output;
}

document.addEventListener('DOMContentLoaded', function () {
    const InputField = document.getElementById('query');
    const OutputField = document.getElementById('results');
    const LoadingElement = document.getElementById('loading');

    // Search tips functionality
    document.querySelectorAll('.search-tip').forEach(tip => {
        tip.addEventListener('click', function () {
            const searchTerm = this.textContent.trim();
            InputField.value = searchTerm;
            InputField.focus();
            // Trigger search
            const event = new Event('input');
            InputField.dispatchEvent(event);
        });
    });

    InputField.addEventListener('input', async (event) => {
        const inputText = event.target.value;
        console.log('Input text:', inputText);

        if (!inputText.trim()) {
            LoadingElement.classList.add('hidden');
            OutputField.innerHTML = '';
            return;
        }

        // 300ms debounce
        if (window.debounceTimeout) {
            clearTimeout(window.debounceTimeout);
        }
        window.debounceTimeout = setTimeout(async () => {
            try {
                // ローディング表示開始
                LoadingElement.classList.remove('hidden');
                OutputField.innerHTML = '';

                const response = await fetch('/api/process', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query: inputText })
                });

                const result = await response.json();
                console.log('Search results:', result);

                const searchResults = renderSearchResults(result);
                OutputField.innerHTML = searchResults;

                // ローディング非表示
                LoadingElement.classList.add('hidden');

                // Add click handlers for new search tips in results
                document.querySelectorAll('.search-tip').forEach(tip => {
                    tip.addEventListener('click', function () {
                        const searchTerm = this.textContent.trim();
                        InputField.value = searchTerm;
                        InputField.focus();
                        // Trigger search
                        const event = new Event('input');
                        InputField.dispatchEvent(event);
                    });
                });

            } catch (error) {
                console.error('Error:', error);
                LoadingElement.classList.add('hidden');
                OutputField.innerHTML = `
                    <div class="text-center py-16">
                        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                            <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">エラーが発生しました</h3>
                        <p class="text-gray-500">しばらく待ってから再度お試しください</p>
                    </div>
                `;
            }
        }, 300);
    });

    // Add enter key support
    InputField.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputEvent = new Event('input');
            InputField.dispatchEvent(inputEvent);
        }
    });

    // Focus on search input when page loads
    InputField.focus();
});