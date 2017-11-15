import { Component } from '@angular/core';
import {
  MainService, DrupalConstants, UserService, SystemService, NodeService, FileAttach, FileService,
  CommentService, TaxonomyTermService, TaxonomyVocabularyService, ViewService, ViewOptions, EntityService,
  CustomEntityOptions, MenuService
} from '../../../index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  result: any;
  entityOptions: CustomEntityOptions = {
    fields: "title,type"
  }

  constructor(
    private mainService: MainService,
    private userService: UserService,
    private systemService: SystemService,
    private nodeService: NodeService,
    private fileService: FileService,
    private commentService: CommentService,
    private taxonomyTermService: TaxonomyTermService,
    private taxonomyVocabularyService: TaxonomyVocabularyService,
    private viewService: ViewService,
    private entityService: EntityService,
    private menuService: MenuService
  ) {
  }

  connect() {
    this.systemService.connect().subscribe(data => {
      this.result = data;
    });
  }

  getVariable() {
    this.systemService.getVariable("testvar").subscribe(data => {
      console.log(data);
    });
  }

  setVariable() {
    this.systemService.setVariable("testvar", {test: "myval"}).subscribe(data => {
      console.log(data);
    });
  }

  delVariable() {
    this.systemService.delVariable("testvar").subscribe(data => {
      console.log(data);
    });
  }

  ////////////////////////////////////

  getUser() {
    this.userService.getUserById(1).subscribe(data => {
      console.log(data);
      this.result = data;
    });
  }

  getAllUsers() {
    this.userService.getUsersList().subscribe(data => {
      console.log(data);
      this.result = data;
    });
  }

  createUser() {
    const user = {
      name: "test",
      mail: "awdwad@awwad.com",
      pass: "awdawd"
    };
    this.userService.createUser(user).subscribe(data => {
      console.log(data)
    });
  }

  updateUser() {
    this.result.user.name = 'teest';
    this.userService.updateUser(this.result).subscribe(data => {
      console.log(data);
    });
  }

  deleteUser() {
    this.userService.deleteUser(3).subscribe(data => {
      console.log(data);
    });
  }

  login() {
    const user = {
      username: "root",
      password: "root"
    }
    this.userService.login(user).subscribe(data => {
      console.log(data);
    });
  }

  logout() {
    this.userService.logout().subscribe(data => {
      console.log(data);
    });
  }

  requestPassword() {
    this.userService.requestNewPassword("root").subscribe(data => {
      console.log(data);
    });
  }

  userPasswordReset() {
    const user = {
      uid: 941,
      timestamp: 	1503219733,
      hashed_pass: 'QQHza2KXN5GgM1IQxeeqllD1PNdeOooF6BQcl4mNboc',
    }
    this.userService.userPasswordReset(user).subscribe(data => {
      console.log(data);
    });
  }

  register() {
    const user = {
      name: "awdaewdawd",
      mail: 'awdwad@awdwead.com',
      pass: 'mypass'
    }
    this.userService.registerAccount(user).subscribe(data => {
      console.log(data);
    });
  }

  cancelUser() {
    this.userService.cancelUser(7).subscribe(data => {
      console.log(data);
    });
  }

  passwordReset() {
    this.userService.passwordReset(7).subscribe(data => {
      console.log(data);
    });
  }

  resendWelcomeEmail() {
    this.userService.resendWelcomeEmail(1).subscribe(data => {
      console.log(data);
    });
  }

  ///////////////////////////////////////////////////////////////////////////


  getNodeById() {
    this.nodeService.getNodeById(1).subscribe(data => {
      console.log(data);
    });
  }

  createNode() {
    const node = {
      title: 'adwadw',
      type: 'article'
    }
    this.nodeService.createNode(node).subscribe(data => {
      console.log(data);
    });
  }

  updateNode() {
    const node = {
      nid: 1,
      title: 'eeeeee',
      type: 'article'
    }
    this.nodeService.updateNode(node).subscribe(data => {
      console.log(data);
    });
  }

  deleteNode() {
    this.nodeService.deleteNode(1).subscribe(data => {
      console.log(data);
    });
  }

  files() {
    this.nodeService.files(2).subscribe(data => {
      console.log(data);
    });
  }

  comments() {
    this.nodeService.comments(2).subscribe(data => {
      console.log(data);
    });
  }

  attachFilesToNode() {
    const file = {
      field_name: 'field_image',
    };
    this.nodeService.attachFilesToNode(2, file).subscribe(data => {
      console.log(data);
    });
  }

  ///////////////////////////////////////////////////////////////

  createFile () {
    const file = {
      file: 'base64,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',
      filename: 'potato.png'
    }
    this.fileService.createFile(file).subscribe(data => {
      console.log(data);
    })
  }

  getAllFiles () {
    this.fileService.getAllFiles().subscribe(data => {
      console.log(data);
    })
  }

  getFileById () {
    this.fileService.getFileById(1).subscribe(data => {
      console.log(data);
    })
  }

  deleteFile() {
    this.fileService.deleteFile(1).subscribe(data => {
      console.log(data);
    })
  }

  createRaw() {
    this.fileService.createRaw().subscribe(data => {
      console.log(data);
    })
  }

  ///////////////////////////////////////////////////

  getAllComments() {
    this.commentService.getAllComments().subscribe(data => {
      console.log(data);
    })
  }

  getCommentById() {
    this.commentService.getCommentById(1).subscribe(data => {
      console.log(data);
    })
  }

  createComment() {
    const comment = {
      nid: 2,
      subject: 'awdwadwadda',
      comment_body: {und: [{value: 'adwdwaadw'}]}
    };
    this.commentService.createComment(comment).subscribe(data => {
      console.log(data);
    })
  }

  updateComment() {
    const comment = {
      cid: 4,
      nid: 2,
      subject: 'eeeeee',
      comment_body: {und: [{value: 'adwdwwwwwwwaadw'}]}
    };
    this.commentService.updateComment(comment).subscribe(data => {
      console.log(data);
    })
  }

  deleteComment() {
    this.commentService.deleteComment(4).subscribe(data => {
      console.log(data);
    })
  }

  countAllByNodeId(nid: number) {
    this.commentService.countAllCommentsByNodeId(2).subscribe(data => {
      console.log(data);
    });
  }

  countNewCommentsByNodeId(nid: number) {
    this.commentService.countNewCommentsByNodeId(2).subscribe(data => {
      console.log(data);
    });
  }

  ///////////////////////////////////////////////////

  getAllTaxonomyTerms() {
    this.taxonomyTermService.getAllTaxonomyTerms().subscribe(data => {
      console.log(data);
    });
  }

  getTaxonomyTermById() {
    this.taxonomyTermService.getTaxonomyTermById(1).subscribe(data => {
      console.log(data);
    });
  }

  createTaxonomyTerm() {
    const term = {
      name: 'test1',
      vid: 1,
    }
    this.taxonomyTermService.createTaxonomyTerm(term).subscribe(data => {
      console.log(data);
    });
  }

  updateTaxonomyTerm() {
    const term = {
      tid: 3,
      name: 'wdawdawadwdwadawd',
      vid: 1,
    }
    this.taxonomyTermService.updateTaxonomyTerm(term).subscribe(data => {
      console.log(data);
    });
  }

  deleteTaxonomyTerm() {
    this.taxonomyTermService.deleteTaxonomyTerm(3).subscribe(data => {
      console.log(data);
    });
  }

  getAllNodesForTerm() {
    this.taxonomyTermService.getAllNodesForTerm(1).subscribe(data => {
      console.log(data);
    });
  }

  ///////////////////////////////////////

  getAllVocabularies() {
    this.taxonomyVocabularyService.getAllVocabularies().subscribe(data => {
      console.log(data);
    })
  }

  getTaxonomyVocabularyById() {
    this.taxonomyVocabularyService.getTaxonomyVocabularyById(1).subscribe(data => {
      console.log(data);
    })
  }

  createTaxonomyVocabulary() {
    const vocabulary = {
      name: "voca"
    };
    this.taxonomyVocabularyService.createTaxonomyVocabulary(vocabulary).subscribe(data => {
      console.log(data);
    })
  }

  updateTaxonomyVocabulary() {
    const vocabulary = {
      name: "test",
      vid: 6,
      machine_name: "voeeeeca"
    };
    this.taxonomyVocabularyService.updateTaxonomyVocabulary(vocabulary).subscribe(data => {
      console.log(data);
    })
  }

  deleteTaxonomyVocabulary() {
    this.taxonomyVocabularyService.deleteTaxonomyVocabulary(6).subscribe(data => {
      console.log(data);
    });
  }

  getTaxonomyVocabularyByMachineName() {
    this.taxonomyVocabularyService.getTaxonomyVocabularyByMachineName("tags").subscribe(data => {
      console.log(data);
    });
  }

  getTaxonomyVocabularyTree() {
    this.taxonomyVocabularyService.getTaxonomyVocabularyTree(1).subscribe(data => {
      console.log(data);
    });
  }

  /////////////////////////////////////////////////

  getView() {
    const options: ViewOptions = {
      filters: {
        year: {
          value: {
            year: 2017
          }
        }
      }
    }
    this.viewService.getView("test", options).subscribe(data => {
      // console.log(data);
    });
  }

  ///////////////////////////////////////

  entityIndex() {
    this.entityService.indexEntity("potato").subscribe(data => {
      console.log(data);
    });
  }

  entityRetrive() {
    this.entityService.retrieveEntity("potato", 1, this.entityOptions).subscribe(data => {
      console.log(data);
    });
  }

  entityDelete() {
    this.entityService.deleteEntity("potato", 1).subscribe(data => {
      console.log(data);
    });
  }

  entityCreate() {
    const entity = {
      type: 'aaaa'
    }
    this.entityService.createEntity("potato", entity).subscribe(data => {
      console.log(data);
    });
  }

  entityUpdate() {
    const entity = {
      title: 'new title',
      type: "aaaa",
      id: 4
    }
    this.entityService.updateEntity("potato", entity, 4).subscribe(data => {
      console.log(data);
    });
  }

  //////////////////////////////////

  menu() {
    this.menuService.getMenu("main-menu").subscribe(data => {
      console.log(data);
    });
  }

}

