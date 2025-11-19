document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    
    searchBtn.addEventListener('click', function() {
        // Create XMLHttpRequest object
        const xhr = new XMLHttpRequest();
        
        // Configure the request
        xhr.open('GET', 'superheroes.php', true);
        
        // Set up callback function
        xhr.onload = function() {
            if (xhr.status === 200) {
                // Extract superhero names from HTML list items
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = xhr.responseText;
                const listItems = tempDiv.querySelectorAll('li');
                
                const superheroes = Array.from(listItems).map(li => li.textContent.trim());
                
                // Show alert with superhero list
                alert(superheroes.join('\n'));
            } else {
                alert('Error fetching superheroes');
            }
        };
        
        // Handle errors
        xhr.onerror = function() {
            alert('Request failed');
        };
        
        // Send the request
        xhr.send();
    });
});