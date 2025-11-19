document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const resultDiv = document.getElementById('result');
    
    // Mock data for superhero details since PHP only returns aliases
    const superheroDetails = {
        "Captain America": {
            name: "Steve Rogers",
            biography: "Recipient of the Super-Soldier serum, World War II hero Steve Rogers fights for American ideals as one of the world's mightiest heroes and the leader of the Avengers."
        },
        "Ironman": {
            name: "Tony Stark", 
            biography: "Genius. Billionaire. Playboy. Philanthropist. Tony Stark's confidence is only matched by his high-flying abilities as the hero called Iron Man."
        },
        "Spiderman": {
            name: "Peter Parker",
            biography: "Bitten by a radioactive spider, Peter Parker's arachnid abilities give him amazing powers he uses to help others, while his personal life continues to offer plenty of obstacles."
        },
        "Captain Marvel": {
            name: "Carol Danvers",
            biography: "Carol Danvers becomes one of the universe's most powerful heroes when Earth is caught in the middle of a galactic war between two alien races."
        },
        "Black Widow": {
            name: "Natasha Romanoff",
            biography: "Despite super spy Natasha Romanoff's checkered past, she's become one of S.H.I.E.L.D.'s most deadly assassins and a frequent member of the Avengers."
        },
        "Hulk": {
            name: "Bruce Banner",
            biography: "Dr. Bruce Banner lives a life caught between the soft-spoken scientist he's always been and the uncontrollable green monster powered by his rage."
        },
        "Hawkeye": {
            name: "Clint Barton",
            biography: "A master marksman and longtime friend of Black Widow, Clint Barton serves as the Avengers' amazing archer."
        },
        "Black Panther": {
            name: "T'Challa", 
            biography: "T'Challa is the king of the secretive and highly advanced African nation of Wakanda - as well as the powerful warrior known as the Black Panther."
        },
        "Thor": {
            name: "Thor Odinson",
            biography: "The son of Odin uses his mighty abilities as the God of Thunder to protect his home Asgard and planet Earth alike."
        },
        "Scarlett Witch": {
            name: "Wanda Maximoff",
            biography: "Notably powerful, Wanda Maximoff has fought both against and with the Avengers, attempting to hone her abilities and do what she believes is right to help the world."
        }
    };
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Sanitize user input
        const query = searchInput.value.trim().toLowerCase();
        
        // Build URL with query parameter
        let url = 'superheroes.php';
        if (query) {
            url += '?query=' + encodeURIComponent(query);
        }
        
        // Create XMLHttpRequest object
        const xhr = new XMLHttpRequest();
        
        // Configure the request
        xhr.open('GET', url, true);
        
        // Set up callback function
        xhr.onload = function() {
            if (xhr.status === 200) {
                // Extract superhero data from HTML response
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = xhr.responseText;
                const listItems = tempDiv.querySelectorAll('li');
                
                const superheroes = Array.from(listItems).map(li => ({
                    alias: li.textContent.trim(),
                    name: superheroDetails[li.textContent.trim()]?.name || '',
                    biography: superheroDetails[li.textContent.trim()]?.biography || ''
                }));
                
                displayResults(superheroes, query);
            } else {
                resultDiv.innerHTML = '<p class="not-found">Error fetching data</p>';
            }
        };
        
        // Handle errors
        xhr.onerror = function() {
            resultDiv.innerHTML = '<p class="not-found">Request failed</p>';
        };
        
        // Send the request
        xhr.send();
    });
    
    function displayResults(superheroes, query) {
        resultDiv.innerHTML = '';
        
        if (superheroes.length === 0) {
            resultDiv.innerHTML = '<p class="not-found">SUPERHERO NOT FOUND</p>';
            return;
        }
        
        if (query) {
            // Filter superheroes based on search query
            const filtered = superheroes.filter(hero => 
                hero.alias.toLowerCase().includes(query) || 
                hero.name.toLowerCase().includes(query)
            );
            
            if (filtered.length === 0) {
                resultDiv.innerHTML = '<p class="not-found">SUPERHERO NOT FOUND</p>';
                return;
            }
            
            // Display filtered results
            if (filtered.length === 1) {
                // Single result - show detailed view
                const hero = filtered[0];
                const heroHTML = `
                    <div class="superhero-detail">
                        <h3>${escapeHTML(hero.alias)}</h3>
                        <h4>A.K.A ${escapeHTML(hero.name)}</h4>
                        <p>${escapeHTML(hero.biography)}</p>
                    </div>
                `;
                resultDiv.innerHTML = heroHTML;
            } else {
                // Multiple results - show list
                const list = document.createElement('ul');
                filtered.forEach(hero => {
                    const listItem = document.createElement('li');
                    listItem.className = 'superhero-item';
                    listItem.textContent = hero.alias;
                    list.appendChild(listItem);
                });
                resultDiv.appendChild(list);
            }
        } else {
            // No query - show all superheroes
            const list = document.createElement('ul');
            superheroes.forEach(hero => {
                const listItem = document.createElement('li');
                listItem.className = 'superhero-item';
                listItem.textContent = hero.alias;
                list.appendChild(listItem);
            });
            resultDiv.appendChild(list);
        }
    }
    
    // Function to escape HTML to prevent XSS
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});