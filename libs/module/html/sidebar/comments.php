<?php

class Module_Html_Sidebar_Comments extends Module_Html_Abstract {

    protected function make_request() {
        return new Request_Count('art_list_comment', $this, array('per_page'=>Config::get('pp', 'latest_comments')));
    }

    public function recieve_data($data) {
        $data = $data['data'];
        $this->set_param('data', $data);
    }

}
