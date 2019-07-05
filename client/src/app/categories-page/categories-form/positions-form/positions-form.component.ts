import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { PositionsService } from "./../../../shared/services/positions.service";
import { Position } from "./../../../shared/interfaces";
import {
  MaterialService,
  MaterialInstance
} from "src/app/shared/classes/material.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-positions-form",
  templateUrl: "./positions-form.component.html",
  styleUrls: ["./positions-form.component.css"]
})
export class PositionsFormComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input("categoryId") categoryId: string;
  @ViewChild("modal") modalRef: ElementRef;

  positions: Position[] = [];
  loading = false;
  modal: MaterialInstance;
  form: FormGroup;
  positionId = null;
  oSub: Subscription;

  constructor(private positionService: PositionsService) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    });

    this.loading = true;
    this.positionService.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions;
      this.loading = false;
    });
  }
  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }
  ngOnDestroy(): void {
    this.modal.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }
  onselectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }
  onAddPosition() {
    this.positionId = null;
    this.form.reset({
      name: null,
      cost: 1
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }
  closeModal() {
    this.modal.close();
  }
  onSubmit() {
    this.form.disable();
    const newPos: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    const completed = () => {
      this.form.enable();
      this.form.reset({ name: "", cost: 1 });
      this.closeModal();
    };

    if (this.positionId) {
      newPos._id = this.positionId;
      this.oSub = this.positionService.update(newPos).subscribe(
        position => {
          const indx = this.positions.findIndex(p => p._id === position._id);
          this.positions[indx] = position;
          MaterialService.toast("Позиция обновлена");
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        () => {
          completed();
        }
      );
    } else {
      this.oSub = this.positionService.create(newPos).subscribe(
        position => {
          MaterialService.toast("Позиция создана");
          this.positions.push(position);
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        () => {
          completed();
        }
      );
    }
  }
  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm("Удалить?");
    if (decision) {
      this.oSub = this.positionService.delete(position).subscribe(
        res => {
          MaterialService.toast("Позиция Удалена");
          const indx = this.positions.findIndex(p => p._id === position._id);
          this.positions.splice(indx, 1);
          MaterialService.toast(res.message);
        },
        error => {
          MaterialService.toast(error.error.message);
        }
      );
    }
  }
}
