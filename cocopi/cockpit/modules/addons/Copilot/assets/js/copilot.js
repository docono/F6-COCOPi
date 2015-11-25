(function($){

    var typefilters = {
        'images'    : /\.(jpg|jpeg|png|gif|svg)$/i,
        'video'     : /\.(mp4|mov|ogv|webv|flv|avi)$/i,
        'audio'     : /\.(mp3|weba|ogg|wav|flac)$/i,
        'archive'   : /\.(zip|rar|7zip|gz)$/i,
        'documents' : /\.(htm|html|pdf)$/i,
        'text'      : /\.(txt|htm|html|php|css|less|js|json|md|markdown|yaml|xml)$/i
    };

    var copilot = {

        createPage: function(root, options) {

            options  = App.$.extend({
                'root': root || '/',
                'parent': 'html',
                'types': App.$.extend({
                    'html': {label: 'Html'},
                    'markdown': {label: 'Markdown', ext: 'md'},
                    'wysiwyg': {label: 'WYSIWYG'}
                }, COPILOT_PAGE_TYPES)
            }, options);

            Object.keys(options.types).forEach(function(type){

                if (COPILOT_PAGE_TYPES[type].parents) {

                    var allowed = Array.isArray(COPILOT_PAGE_TYPES[type].parents) ? COPILOT_PAGE_TYPES[type].parents:[COPILOT_PAGE_TYPES[type].parents];

                    if (allowed.indexOf(options.parent) == -1) {
                        delete options.types[type];
                    }
                }
            });

            var dialog = UIkit.modal.dialog(App.Utils.multiline(function() {/*

                <div riot-view>
                    <div class="uk-modal-header uk-text-large">
                        Create Page
                        <div class="uk-text-muted uk-text-small uk-margin-small-top"><i class="uk-icon-link"></i> { opts.root=='home' || opts.root=='/'  ? '':opts.root }/{ slug.value || slugpreview }</div>
                    </div>
                    <form id="frmNewPage" class="uk-form" onsubmit="{create}">
                        <div class="uk-form-row">
                            <label class="uk-text-small">Title</label>
                            <input name="title" type="text" class="uk-width-1-1 uk-form-large" onkeyup="{ updateSlugPreview }" required>
                        </div>
                        <div class="uk-form-row" if="{opts.root!='home'}">
                            <label class="uk-text-small">Slug</label>
                            <input name="slug" type="text" class="uk-width-1-1 uk-form-large" placeholder="{ slugpreview }"  onkeyup="{ updateSlugPreview }">
                        </div>
                        <div class="uk-form-row">
                            <label class="uk-text-small">Type</label>
                            <div class="uk-margin-small-top">
                            <div class="uk-display-inline-block" data-uk-dropdown="\{mode:'click'\}">
                                <a class="{ Object.keys(opts.types).length > 1 ? '':'uk-link-muted' }">{ (opts.types[type] && opts.types[type].label) || type }</a>
                                <div class="uk-dropdown" if="{ Object.keys(opts.types).length > 1 }">
                                    <ul class="uk-nav uk-nav-dropdown">
                                        <li class="uk-nav-header">Select a type</li>
                                        <li each="{key,val in opts.types}">
                                            <a class="uk-dropdown-close" data-type="{ key }" onclick="{ parent.selectType }">{ val.label || key }</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            </div>
                        </div>
                    </form>
                    <div class="uk-modal-footer uk-text-right">
                        <button class="uk-button uk-button-primary uk-margin-right uk-button-large js-create-button" onclick="jQuery('#frmNewPage').submit()">Create</button>
                        <button class="uk-button uk-button-link uk-button-large uk-modal-close">Cancel</button>
                    </div>

                    <script type="view/script">

                        this.slugpreview = '';
                        this.type = Object.keys(opts.types)[0] || 'html';

                        updateSlugPreview() {
                            this.slugpreview = this.title.value.toLowerCase().replace(/\s/g, '-');
                        };

                        create() {

                            App.request('/copilot/utils/createPage', {root: opts.root, meta: {
                                title: this.title.value,
                                slug: this.slug ? this.slug.value :'',
                                type : this.type
                            }}).then(function(data) {

                                if (data) {
                                    location.href = App.route('/copilot/page'+data.relpath);
                                }
                            });
                        };

                        selectType(e) {
                            this.type = e.target.getAttribute('data-type');
                        };

                    </script>

                </div>

            */}), {modal:false});

            options.dialog = dialog;

            riot.util.initViews(dialog.element[0], options);

            dialog.show();

            setTimeout(function(){
                dialog.element.find(':input:first').focus();
            }, 100);
        },

        selectUrl: function(release, options) {

            options  = App.$.extend({
                release: release || function(data) {}
            }, options);


            var dialog = UIkit.modal.dialog(App.Utils.multiline(function() {/*

                <div riot-view>
                    <div class="uk-modal-header uk-text-large">
                        Select Url
                    </div>
                    <form id="frmSelectLink" class="uk-form" onsubmit="{select}">
                        <div class="uk-form-row">
                            <label class="uk-text-small">Pages</label>

                            <div class="uk-margin-top uk-text-large" show="{ !pages }">
                                <i class="uk-icon-spinner uk-icon-spin"></i>
                            </div>

                            <div class="uk-scrollable-box" show="{ pages && pages.length }">
                                <ul class="uk-list">
                                <li class="uk-margin-small-top uk-text-truncate" each="{page in pages}" style="padding-left: {(page.depth * 16)}px">
                                    <a onclick="{ parent.apply }"><i class="uk-icon-file-text-o"></i> { page.meta.title }</a>
                                </li>
                                </ul>
                            </div>

                            <div class="uk-alert" show="{ pages && !pages.length }">No pages found</div>
                        </div>
                        <div class="uk-form-row">
                            <label class="uk-text-small">Title</label>
                            <input name="title" type="text" class="uk-width-1-1 uk-form-large" required>
                        </div>
                        <div class="uk-form-row">
                            <label class="uk-text-small">Url</label>
                            <input name="url" type="text" class="uk-width-1-1 uk-form-large" required>
                        </div>
                    </form>
                    <div class="uk-modal-footer uk-text-right">
                        <button class="uk-button uk-button-primary uk-margin-right uk-button-large js-create-button" onclick="jQuery('#frmSelectLink').submit()" show="{url.value}">Select</button>
                        <button class="uk-button uk-button-link uk-button-large uk-modal-close">Cancel</button>
                    </div>

                    <script type="view/script">

                        var $this = this;

                        this.pages = null;

                        App.callmodule('copilot:find').then(function(data) {
                            $this.pages = data.result;
                            $this.update();
                        });

                        apply(e) {
                            this.url.value   = e.item.page.url;
                            this.title.value = e.item.page.meta.title;
                        }

                        select() {
                            opts.release({url:this.url.value, title:this.title.value});
                            opts.dialog.hide();
                        };

                    </script>

                </div>

            */}), {modal:false});

            options.dialog = dialog;

            riot.util.initViews(dialog.element[0], options);

            dialog.show();

            setTimeout(function(){
                dialog.element.find(':input:first').focus();
            }, 100);

        },

        getFileIconCls: function(filename) {

            if (filename.match(typefilters.images)) {

                return 'image';

            } else if(filename.match(typefilters.video)) {

                return 'video';

            } else if(filename.match(typefilters.text)) {

                return 'pencil';

            } else if(filename.match(typefilters.archive)) {

                return 'archive';

            } else {
                return 'file-o';
            }
        },

        getTypeLabel: function(type) {
            return COPILOT_PAGE_TYPES[type] && COPILOT_PAGE_TYPES[type].label || type;
        }
    };

    App.$.extend(true, App, copilot);

    // register page picker
    App.$(document).on('init-html-editor', function(e, editor){

        editor.off('action.link').on('action.link', function() {

            copilot.selectUrl(function(data){

                if (editor.getCursorMode() == 'markdown') {
                    editor['replaceSelection']('['+data.title+']('+data.url+')');
                } else {
                    editor['replaceSelection']('<a href="'+data.url+'">'+data.title+'</a>');
                }

            }, {url:'',title:''});

        });
    });

    App.$(document).on('init-wysiwyg-editor', function(e, editor){

        var button = editor.button.add('link', 'Page Link');

        editor.button.addCallback(button, function(){

            editor.selection.save();

            copilot.selectUrl(function(data){

                editor.link.$inputUrl  = {val:function(){ return data.url; }};
                editor.link.$inputText = {val:function(){ return data.title; }};

                editor.link.insert();

            }, editor.observe.isCurrent('a') ? {url:'',title:''} : {url:'',title:''});
        });

    });

    window.copilot = copilot;

})(jQuery);
