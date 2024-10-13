import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../models/product-interface'; // Adjust path if necessary

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  taskForm: FormGroup;
  taskId: number | null=null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      assignedTo: ['', Validators.required],
      status: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      comments: ['']
    });
  }

  ngOnInit(): void {
    this.taskId = +this.route.snapshot.paramMap.get('id')!;
    if (this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe((task) => {
        if (task) {
          this.taskForm.patchValue(task); // Populate form with existing task data
        }
      });
    }

  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const task: Task = {
        id: this.taskId !== null ? this.taskId : Date.now(), // Generate new ID as number if adding
        ...this.taskForm.value
      };

      console.log(task.id);


      if (this.taskId) {
        this.taskService.updateTask(task).subscribe(() => {
          this.router.navigate(['/']); // Redirect after saving
        });
      } else {
        this.taskService.addTask(task).subscribe(() => {
          this.router.navigate(['/']); // Redirect after saving
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/']); // Navigate back to the list
  }
}
