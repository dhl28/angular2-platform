import {Component} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ApiService} from "../../core/api.service";
import 'rxjs/add/operator/switchMap';

declare var $: any;

@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent {
  constructor(public apiService: ApiService, private route: ActivatedRoute, private router: Router) {

  }

  keyWord = "";
  isLoading:boolean = false;
  isLoading1:boolean = false;

  appSearchResult = {
    list: [],
    total: 3
  };
  apiSearchResult = {
    list: [],
    total: 2
  };
  TABS = ['tab_app', 'tab_api'];
  currentTab = this.TABS[0];

  //pagination
  //分页参数 - app
  appPageOpts = {
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 10,
    maxSize: 5,
    sortFieldName: 'time',
    isDesc: true
  }
  //分页参数 - api
  apiPageOpts = {
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 10,
    maxSize: 5,
    sortFieldName: 'time',
    isDesc: true
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => {
          this.keyWord = params['keyWord'];
          this.searchApi();
          this.isLoading = true;
          return this.apiService.searchApp(this.getPaginationParam('app'))
        }
      )
      .subscribe((d) => {
        this.isLoading = false;
        if (!d.error) {
          this.appSearchResult = d;
          this.appPageOpts.totalItems = d.total;
        }
      });

  }

  selectTab(tabIndex) {
    this.currentTab = this.TABS[tabIndex];
  }

  activeTab(tabIndex) {

  }

  //app - 分页
  public pageChanged0(event: any): void {
    let page = event.page - 1;
    this.searchApp(page);
  };

  public pageChanged1(event: any): void {
    let page = event.page - 1;
    this.searchApi(page);
  };

  //排序
  order(sortField) {
    let pageOpts: any = {};
    if (this.currentTab == this.TABS[0]) {
      pageOpts = this.appPageOpts;
    } else if (this.currentTab == this.TABS[1]) {
      pageOpts = this.apiPageOpts;
    }
    if (pageOpts.sortFieldName === sortField) {
      pageOpts.isDesc = !pageOpts.isDesc;
    } else {
      pageOpts.sortFieldName = sortField;
      pageOpts.isDesc = true;
    }
    this.doOrder();
  }

  doOrder() {
    if (this.currentTab == this.TABS[0]) {
      this.searchApp();
    } else if (this.currentTab == this.TABS[1]) {
      this.searchApi();
    }
  }

  searchApp(page = null) {
    this.isLoading = true;
    let query = this.getPaginationParam('app');
    if (page != null) {
      query.page = page;
    }
    this.apiService.searchApp(query)
      .subscribe((d) => {
        this.isLoading = false;
        if (!d.error) {
          this.appSearchResult = d;
          this.appPageOpts.totalItems = d.total;
        }
      });
  }

  searchApi(page = null) {
    this.isLoading1 = true;
    let query = this.getPaginationParam('api');
    if (page != null) {
      query.page = page;
    }
    this.apiService.searchApi(query).then(d=> {
      this.isLoading1 = false;
      // this.apiService.getDataServerList().then(d=> {
      if (!d.error) {
        this.apiSearchResult = d;
        this.apiPageOpts.totalItems = d.total;
      }
    })
  }

  getPaginationParam(type: string) {
    let opts: any = {};
    let metaData: any = {};
    if (type === 'app') {
      metaData = this.appPageOpts;
    } else if (type === 'api') {
      metaData = this.apiPageOpts;
    }
    opts.sort = metaData.sortFieldName;
    opts.desc = metaData.isDesc;
    opts.size = metaData.itemsPerPage;
    opts.page = metaData.currentPage - 1;
    opts.keywords = this.keyWord;
    return opts;
  }

  //app详情
  viewApp(item) {
    this.router.navigate(['/portal/app', item.pk]);
  }

}
