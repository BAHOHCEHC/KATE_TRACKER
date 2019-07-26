import { ElementRef } from "@angular/core";

declare var M;
export interface MaterialInstance {
  open?(): void;
  close?(): void;
  destroy?(): void;
}

export interface MaterialDatepicker extends MaterialInstance {
  date?: Date;
}
export class MaterialService {
  static toast(message: string) {
    M.toast({ html: message, displayLength: 1000 });
  }

  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement);
  }
  static updateTextInputs() {
    M.updateTextFields();
  }
  static initModal(ref: ElementRef): MaterialInstance {
    return M.Modal.init(ref.nativeElement);
  }
  static initSelect(ref: ElementRef): MaterialInstance {
    return M.FormSelect.init(ref.nativeElement);
  }
  static initTooltip(ref: ElementRef): MaterialInstance {
    return M.Tooltip.init(ref.nativeElement);
  }
  static initTaptarget(ref: ElementRef): MaterialInstance {
    return M.TapTarget.init(ref.nativeElement);
  }
  static initDatepicker(
    ref: ElementRef,
    onClose: () => void
  ): MaterialDatepicker {
    return M.Datepicker.init(ref.nativeElement, {
      format: "dd.mm.yyyy",
      showClearBtn: false,
      i18n: {
        weekdaysAbbrev: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        done	: "Select"
      },
      onClose
    });
  }
}
