(function($){


    var Cockpit = {

        callmodule: function (module, method, args, acl) {

            if (module.indexOf(':') !== -1) {

                var parts = module.split(':');

                args   = method;
                acl    = args;

                module = parts[0];
                method = parts[1];
            }

            args = args || [];
            acl  = acl || 'manage.'+module;

            if (!Array.isArray(args)) args = [args];

            var req = App.request('/cockpit/call/'+module+'/'+method, {args:args, acl:acl});

            // catch any error
            req.catch(function(){

            });

            return req;
        },

        media: {

            select: function(callback, options) {

                callback = callback || function(){};

                options  = App.$.extend({
                    previewfiles: false,
                    pattern  : '*',
                    typefilter: '',
                    path: false,
                    selected : []
                }, options)

                var selected = [], dialog = UIkit.modal.dialog([
                    '<div>',
                        '<div class="uk-modal-header uk-text-large">Select file</div>',
                        '<cp-finder path="'+(options.path || '')+'" typefilter="'+(options.typefilter || '')+'"></cp-finder>',
                        '<div class="uk-modal-footer uk-text-right">',
                            '<button class="uk-button uk-button-primary uk-margin-right uk-button-large uk-hidden js-select-button">Select: <span></span> item(s)</button>',
                            '<button class="uk-button uk-button-large uk-modal-close">Close</button>',
                        '</div>',
                    '</div>'
                ].join(''), {modal:false});

                dialog.dialog.addClass('uk-modal-dialog-large');

                var selectbtn   = dialog.dialog.find('.js-select-button'),
                    selectcount = selectbtn.find('span');

                riot.mount(dialog.element[0], '*', options);

                selectbtn.on('click', function() {
                    callback(selected);
                    dialog.hide();
                });

                dialog.on('selectionchange', function(e, s) {

                    selected = [];

                    if (s.count) {

                        Object.keys(s.paths).forEach(function(path) {

                            if (options.pattern == '*' || matchName(options.pattern, path)) {
                                selected.push(path);
                            }
                        });
                    }

                    selectbtn[selected.length ? 'removeClass':'addClass']('uk-hidden');
                    selectcount.text(selected.length);
                });

                dialog.show();
            }
        }
    };

    App.$.extend(true, App, Cockpit);

    window.Cockpit = Cockpit;


    function matchName(pattern, path) {

        path = path.split('/').pop();

        var parsedPattern = '^' + pattern.replace(/\//g, '\\/').
            replace(/\*\*/g, '(\\/[^\\/]+)*').
            replace(/\*/g, '[^\\/]+').
            replace(/((?!\\))\?/g, '$1.') + '$';

        parsedPattern = '^' + parsedPattern + '$';

        return (path.match(new RegExp(parsedPattern, 'i')) !== null);
    }

})(jQuery);
