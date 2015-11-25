<?php

namespace Cockpit\Helper;

use ArrayObject;

/**
 * Admin Helper class.
 */
class Admin extends \Lime\Helper {

    public $data;
    public $options;
    public $user;

    public function initialize(){

        $this->data =  new \ContainerArray();
        $this->options = [];
        $this->user = $this->app->module('cockpit')->getUser();
        $this->user['data'] = new \ContainerArray(isset($this->user['data']) && is_array($this->user['data']) ? $this->user['data']:[]);
    }


    public function init() {

        // extend lexy parser
        $this->app->renderer->extend(function($content){
            return preg_replace('/(\s*)@hasaccess\?\((.+?)\)/', '$1<?php if ($app->module("cockpit")->hasaccess($2)) { ?>', $content);
        });

        $this->data->extend([

            'cockpit' => json_decode($this->app->helper('fs')->read('#root:package.json'), true),

            /**
             * Admin assets
             */
            'assets'  => new ArrayObject(array_merge($this->app['app.assets.base'], [

                // uikit components
                'assets:lib/uikit/js/components/autocomplete.min.js',
                'assets:lib/uikit/js/components/tooltip.min.js',

                // app related
                'assets:app/js/bootstrap.js'

            ], $this->app->retrieve('config/app.assets.backend', []))),

            /**
             * web components
             */
            'components' => new ArrayObject([]),

            /**
             * admin menus
             */
            'menu.modules' => new ArrayObject([]),

            /**
             * extract to App.$data
             */
            'extract' => [
                'user'      => $this->user,
                'locale'    => $this->app('i18n')->locale,
                'site_url'  => $this->app->pathToUrl('site:'),
                'languages' => $this->app->retrieve('config/languages', [])
            ]
        ]);
    }

    public function addMenuItem($menu, $data) {

        $this->data["menu.{$menu}"]->append(array_merge([
            'label' => '',
            'icon'  => 'cube',
            'route' => '/',
            'active' => false
        ], $data));

        return $this;
    }

    public function getOption($key, $default = null) {

        if (!isset($this->options[$key])) {

            $this->options[$key] = $this->app->storage->getKey("cockpit/options", $key, $default);
        }

        return $this->options[$key];
    }

    public function setOption($key, $value) {

        $this->options[$key] = $value;
        $this->app->storage->setKey("cockpit/options", $key, $value);

        return $value;
    }

    public function getUserOption($key, $default = null) {

        return $this->user['data']->get($key, $default);
    }

    public function setUserOption($key, $value) {

        $this->user['data']->set($key, $value);

        return $this->app->module('cockpit')->updateUserOption($key, $value);
    }
}
