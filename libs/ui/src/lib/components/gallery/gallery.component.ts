import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-gallery',
  templateUrl: './gallery.component.html',
  styles: [
  ]
})
export class GalleryComponent implements OnInit {

  selectedImage = '';

  @Input() images: string[] = [];

  ngOnInit(): void {
    if(this.hasImages) {
      this.selectedImage = this.images[0];
    }
  }

  changeImage(image: string) {
    this.selectedImage = image;
  }

  get hasImages() {
    return this.images?.length > 0;
  }

}
