
class App{
    constructor(){
        this.topContainer = document.querySelector("#top-items");
        this.bottomContainer = document.querySelector("#bottom-items");
        this.footwearContainer = document.querySelector("#footwear-items");
        this.topImages = [];
        this.bottomImages = [];
        this.footwearImages = [];

        /* made an original copy to separate the query and creation logic as it made filtering easier */
        this.allTopImages = [];
        this.allBottomImages = [];
        this.allFootwearImages = [];

        this.queryClothes();

        this.filter = document.querySelector('#sidebar');
        this.filter.addEventListener('change',this.filterItems.bind(this));
    }

    // This method maps each image to its corresponding clothing row and creates a new card for every item added.
    // It then appends each element to the container it relates to
    createClothingItem(){
        this.topContainer.innerHTML = '';
        this.bottomContainer.innerHTML = '';
        this.footwearContainer.innerHTML = '';

        const itemsMappedTop = this.topImages.map(image => new CreateCard(image).element);
        itemsMappedTop.forEach(el => this.topContainer.appendChild(el));
    
        const itemsMappedBottom = this.bottomImages.map(image => new CreateCard(image).element);
        itemsMappedBottom.forEach(el => this.bottomContainer.appendChild(el));
    
        const itemsMappedFootwear = this.footwearImages.map(image => new CreateCard(image).element);
        itemsMappedFootwear.forEach(el => this.footwearContainer.appendChild(el));
    }

    //this method fetches the clothes from the json and pushes them to there correct array
    async queryClothes(){
        const response = await fetch("./clothes.json");
        const data = await response.json();
        for(const dataObject of data){

            if (dataObject.category === "tops") {
                this.topImages.push(dataObject);
                this.allTopImages.push(dataObject);
            }
            if (dataObject.category === "bottoms") {
                this.bottomImages.push(dataObject);
                this.allBottomImages.push(dataObject);
            }
            if (dataObject.category === "footwear") {
                this.footwearImages.push(dataObject);
                this.allFootwearImages.push(dataObject);

            }
        }
        this.createClothingItem();
    }

    filterItems(){
        const checkboxes = Array.from(document.querySelectorAll('[name="itemFilter"]:checked')); // copied from HW3 selects all checkboxes with that name and that are checked

        const checkbox_values = checkboxes.map(checkbox => checkbox.value);

        if(checkbox_values.length === 0){
            this.topImages = this.allTopImages;
            this.bottomImages = this.allBottomImages;
            this.footwearImages = this.allFootwearImages;
            this.createClothingItem();
            return;
        }

        // handles the 3 sections separately checks if any of the items in each array have any of the checkboxes that are checked
        // stores the ones that do from the all into the smaller sections
        // helper function filterMatch to deal with checkbox value checking
        this.topImages = this.allTopImages.filter(item => {
            return this.filterMatch(item, checkbox_values);
        });
        
        this.bottomImages = this.allBottomImages.filter(item => {
            return this.filterMatch(item, checkbox_values);
        });
        
        this.footwearImages = this.allFootwearImages.filter(item => {
            return this.filterMatch(item, checkbox_values);
        });

        this.createClothingItem();
    }

    filterMatch(item, filters) {
        // if the clothing type checkboxes match the clothing type of our item
        if (filters.includes(item.clothingType)) return true;
        
        // if the style checkboxes match the style of our item
        for (const style of item.style) {
            if (filters.includes(style)) return true;
        }
        
        // check if any of the seasons in the item.season list are checked
        for (const season of item.season) {
            if (filters.includes(season)) return true;
        }
        
        return false;
    }
}

// This class handles all of the html creation code 
// It takes in an image and creates the container for it
class CreateCard {
    constructor(image) {
        this.image = image;
        this.element = this.createClothCard();
    }

    createClothCard() {
        const item = document.createElement("div");
        item.classList.add("item");

        const imageSrc = document.createElement("img");
        imageSrc.classList.add("image");
        imageSrc.src = this.image.clothLink;
        imageSrc.alt = this.image.name;
        item.appendChild(imageSrc);

        return item;
    }
}

export default App;