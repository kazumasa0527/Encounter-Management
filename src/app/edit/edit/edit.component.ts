import { Component, OnInit, HostListener } from '@angular/core';
import { Friend } from 'src/app/interfaces/friend';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FriendService } from 'src/app/services/friend.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  target: Friend;
  isComplete: boolean;

  form = this.fb.group({
    familyName: ['', Validators.maxLength(30)],
    givenName: ['', Validators.maxLength(30)],
    nickName: ['', [Validators.required, Validators.maxLength(20)]],
    familyNameKana: ['', Validators.maxLength(30)],
    givenNameKana: ['', Validators.maxLength(30)],
    gender: [''],
    age: [null],
    job: ['', Validators.maxLength(30)],
    holiday: ['', Validators.maxLength(30)],
    history: ['', Validators.maxLength(400)],
    birthplace: ['', Validators.maxLength(30)],
    nearestStation: ['', Validators.maxLength(30)],
    hobby: ['', Validators.maxLength(30)],
    lastday: [null],
    memo: ['', [Validators.maxLength(400)]],
  });

  constructor(
    private fb: FormBuilder,
    private friendService: FriendService,
    private route: ActivatedRoute
  ) {
    // クエリーパラメータを使って記事データを取得
    this.route.queryParamMap
      .pipe(
        switchMap((params) => {
          return this.friendService.getFriend(params.get('id'));
        })
      )
      .subscribe((friend) => {
        this.target = friend;
        // フォームに初期値をセット
        this.form.patchValue({
          ...friend,
          lastday: null,
        });
        this.lastday.setValue(this.target?.lastday.toDate() || null);
      });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.form.dirty) {
      // この部分でガードすべきかを判断
      $event.preventDefault();
      $event.returnValue = '作業中の内容が失われますがよろしいですか？';
    }
  }

  get familyName() {
    return this.form.get('familyName') as FormControl;
  }
  get givenName() {
    return this.form.get('givenName') as FormControl;
  }
  get nickName() {
    return this.form.get('nickName') as FormControl;
  }
  get familyNameKana() {
    return this.form.get('familyNameKana') as FormControl;
  }
  get givenNameKana() {
    return this.form.get('givenNameKana') as FormControl;
  }
  get job() {
    return this.form.get('job') as FormControl;
  }
  get history() {
    return this.form.get('history') as FormControl;
  }
  get holiday() {
    return this.form.get('holiday') as FormControl;
  }
  get birthplace() {
    return this.form.get('birthplace') as FormControl;
  }
  get nearestStation() {
    return this.form.get('nearestStation') as FormControl;
  }
  get hobby() {
    return this.form.get('hobby') as FormControl;
  }
  get lastday() {
    return this.form.get('lastday') as FormControl;
  }
  get memo(): FormControl {
    return this.form.get('memo') as FormControl;
  }

  ngOnInit(): void {}

  submit() {
    if (this.target) {
      const value = this.form.value;
      this.isComplete = true;
      const newTarget: Friend = {
        ...this.target,
        familyName: value.familyName,
        givenName: value.givenName,
        nickName: value.nickName,
        familyNameKana: value.familyNameKana,
        givenNameKana: value.givenNameKana,
        age: value.age,
        gender: value.gender,
        job: value.job,
        holiday: value.holiday,
        nearestStation: value.nearestStation,
        hobby: value.hobby,
        birthplace: value.birthplace,
        history: value.history,
        lastday: value.lastday,
        memo: value.memo,
      };
      this.friendService.updateFriend(newTarget);
      console.log(newTarget);
    } else {
      const value = this.form.value;
      this.isComplete = true;
      this.friendService.createFriend({
        familyName: value.familyName,
        givenName: value.givenName,
        nickName: value.nickName,
        familyNameKana: value.familyNameKana,
        givenNameKana: value.givenNameKana,
        age: value.age,
        gender: value.gender,
        job: value.job,
        holiday: value.holiday,
        nearestStation: value.nearestStation,
        hobby: value.hobby,
        birthplace: value.birthplace,
        history: value.history,
        lastday: value.lastday,
        memo: value.memo,
      });
    }
  }
}
