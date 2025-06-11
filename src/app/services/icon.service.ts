import { Injectable, inject } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faBolt,
  faCheck,
  faCheckCircle,
  faCog,
  faComments,
  faDesktop,
  faDownload,
  faEdit,
  faEnvelope,
  faEye,
  faEyeSlash,
  faHeart,
  faHome,
  faLock,
  faMinus,
  faPhone,
  faPlus,
  faRocket,
  faSearch,
  faShare,
  faStar,
  faTimes,
  faTrash,
  faUnlock,
  faUpload,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private library = inject(FaIconLibrary);

  constructor() {
    // Add commonly used icons to the library
    this.library.addIcons(
      faHome,
      faUser,
      faEnvelope,
      faPhone,
      faHeart,
      faStar,
      faSearch,
      faCog,
      faEdit,
      faTrash,
      faPlus,
      faMinus,
      faCheck,
      faTimes,
      faArrowUp,
      faArrowDown,
      faArrowLeft,
      faArrowRight,
      faDownload,
      faUpload,
      faShare,
      faLock,
      faUnlock,
      faEye,
      faEyeSlash,
      // Additional icons used in the app
      faRocket,
      faDesktop,
      faBolt,
      faComments,
      faCheckCircle
    );
  }
}
