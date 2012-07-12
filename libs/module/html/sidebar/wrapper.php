<?php

class Module_Html_Sidebar extends Module_Html_Abstract {

    protected function get_modules(Query $query) {
        return new Module_Html_Sidebar_Comments($query);
    }

}
