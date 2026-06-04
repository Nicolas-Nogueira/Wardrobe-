class App{
    constructor(){
        this.topImages = [];
        this.bottomImages = [];
        this.footwearImages = [];

        /* made an original copy to separate the query and creation logic as it made filtering easier */
        this.allTopImages = [];
        this.allBottomImages = [];
        this.allFootwearImages = [];
        
        // index starts at 0 for next and prev
        this.currentTopIndex = 0;
        this.currentBottomIndex = 0;
        this.currentShoesIndex = 0;

        // Lock state tracking
        this.topLocked = false;
        this.bottomLocked = false;
        this.shoesLocked = false;

        this.queryClothes();

        this.filter = document.querySelector('#sidebar');
        this.filter.addEventListener('change',this.filterItems.bind(this));

        // Top arrows
        const rightArrowTop = document.querySelector('#top-slot .arrow-btn-right-arrow');
        const leftArrowTop = document.querySelector('#top-slot .arrow-btn-left-arrow');
        rightArrowTop.addEventListener('click', this.nextTop.bind(this));
        leftArrowTop.addEventListener('click', this.previousTop.bind(this));
 
        // Bottom arrows
        const rightArrowBottom = document.querySelector('#bottoms-slot .arrow-btn-right-arrow');
        const leftArrowBottom = document.querySelector('#bottoms-slot .arrow-btn-left-arrow');
        rightArrowBottom.addEventListener('click', this.nextBottom.bind(this));
        leftArrowBottom.addEventListener('click', this.previousBottom.bind(this));
 
        // Shoes arrows
        const rightArrowShoes = document.querySelector('#shoes-slot .arrow-btn-right-arrow');
        const leftArrowShoes = document.querySelector('#shoes-slot .arrow-btn-left-arrow');
        rightArrowShoes.addEventListener('click', this.nextShoes.bind(this));
        leftArrowShoes.addEventListener('click', this.previousShoes.bind(this));

        //Lock bottom
        const topLockBtn = document.querySelector('#top-slot .lock-btn');
        const bottomLockBtn = document.querySelector('#bottoms-slot .lock-btn');
        const shoesLockBtn = document.querySelector('#shoes-slot .lock-btn');

        topLockBtn.addEventListener('click', () => this.toggleLock('top'));
        bottomLockBtn.addEventListener('click', () => this.toggleLock('bottoms'));
        shoesLockBtn.addEventListener('click', () => this.toggleLock('shoes'));
    }

    toggleLock(slot) {
        let lockBtn;
        
        // Determine which slot and get its button
        if (slot === 'top') {
            this.topLocked = !this.topLocked;
            lockBtn = document.querySelector('#top-slot .lock-btn');
        } else if (slot === 'bottoms') {
            this.bottomLocked = !this.bottomLocked;
            lockBtn = document.querySelector('#bottoms-slot .lock-btn');
        } else if (slot === 'shoes') {
            this.shoesLocked = !this.shoesLocked;
            lockBtn = document.querySelector('#shoes-slot .lock-btn');
        }
        
        // Update the lock button image and aria-pressed
        const img = lockBtn.querySelector('img');
        if (slot === 'top' ? this.topLocked : slot === 'bottoms' ? this.bottomLocked : this.shoesLocked) {
            img.src = 'images/locked.png';
            lockBtn.setAttribute('aria-pressed', 'true');
        } else {
            img.src = 'images/unlocked.png';
            lockBtn.setAttribute('aria-pressed', 'false');
        }
    }

    // Gen Oufit
    randomOutfit() {
        if (!this.topImages?.length || !this.bottomImages?.length || !this.footwearImages?.length) {
            console.warn("Missing images to generate an outfit.");
            return;
        }
    
        // gen a random num from 0 to the lenght of the image array 
        const randomTop = Math.floor(Math.random() * this.topImages.length);
        const randomBottom = Math.floor(Math.random() * this.bottomImages.length);
        const randomFootwear = Math.floor(Math.random() * this.footwearImages.length);
    
        // Only change if NOT locked
        if (!this.topLocked) {
            this.currentTopIndex = randomTop;
        }
    
        if (!this.bottomLocked) {
            this.currentBottomIndex = randomBottom;
        }
    
        if (!this.shoesLocked) {
            this.currentShoesIndex = randomFootwear;
        }

        // Validate and display the outfit
        this.displayOutfit();
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
        this.randomOutfit();
    }

    filterItems(){
        const checkboxes = Array.from(document.querySelectorAll('[name="itemFilter"]:checked')); // copied from HW3 selects all checkboxes with that name and that are checked

        const checkbox_values = checkboxes.map(checkbox => checkbox.value);

        if(checkbox_values.length === 0){
            this.topImages = this.allTopImages;
            this.bottomImages = this.allBottomImages;
            this.footwearImages = this.allFootwearImages;
            this.randomOutfit();
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

        this.randomOutfit();
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

    // Unified display method with filter validation
    displayOutfit() {
        const top = this.topImages[this.currentTopIndex];
        const bottom = this.bottomImages[this.currentBottomIndex];
        const shoes = this.footwearImages[this.currentShoesIndex];
        
        if (this.outfitIsValid(top, bottom, shoes)) {
            // Display all three items
            this.updateImageElement("#top-image", top);
            this.updateImageElement("#bottom-image", bottom);
            this.updateImageElement("#shoes-image", shoes);
        } else {
            // Generate new outfit if no matching filters
            this.randomOutfit();
        }
    }

    // Helper method to update image elements and reduce code duplication
    updateImageElement(selector, clothingItem) {
        const imageEl = document.querySelector(selector);
        imageEl.src = clothingItem.clothLink;
        imageEl.alt = clothingItem.name;
    }

    // Check if outfit items share at least one common filter
    outfitIsValid(top, bottom, shoes) {
        const topFilters = this.getItemFilters(top);
        const bottomFilters = this.getItemFilters(bottom);
        const shoeFilters = this.getItemFilters(shoes);
        
        // Find if there's at least one common filter across all three
        return topFilters.some(f => 
            bottomFilters.includes(f) && shoeFilters.includes(f)
        );
    }

    // Extract all filters (clothing type, style, season) from an item
    getItemFilters(item) {
        return [
            item.clothingType,
            ...item.style,
            ...item.season
        ];
    }

    // Top arrows method 
    nextTop() {
        if (this.topLocked) return;

        if (this.currentTopIndex < this.topImages.length - 1) {
            this.currentTopIndex++;
        } else {
            this.currentTopIndex = 0;
        }
        this.displayOutfit();
    }
    
    previousTop() {
        if (this.topLocked) return;

        if (this.currentTopIndex > 0) {
            this.currentTopIndex--;
        } else {
            this.currentTopIndex = this.topImages.length - 1;
        }
        this.displayOutfit();
    }

    // Bottom arrow methods 
    nextBottom() {
        if (this.bottomLocked) return;
        if (this.currentBottomIndex < this.bottomImages.length - 1) {
            this.currentBottomIndex++;
        } else {
            this.currentBottomIndex = 0;
        }
        this.displayOutfit();
    }
    
    previousBottom() {
        if (this.bottomLocked) return;

        if (this.currentBottomIndex > 0) {
            this.currentBottomIndex--;
        } else {
            this.currentBottomIndex = this.bottomImages.length - 1;
        }
        this.displayOutfit();
    }

    // Shoes arrow methods 
    nextShoes() {
        if (this.shoesLocked) return;

        if (this.currentShoesIndex < this.footwearImages.length - 1) {
            this.currentShoesIndex++;
        } else {
            this.currentShoesIndex = 0;
        }
        this.displayOutfit();
    }
    
    previousShoes() {
        if (this.shoesLocked) return;

        if (this.currentShoesIndex > 0) {
            this.currentShoesIndex--;
        } else {
            this.currentShoesIndex = this.footwearImages.length - 1;
        }
        this.displayOutfit();
    }
}

export default App;