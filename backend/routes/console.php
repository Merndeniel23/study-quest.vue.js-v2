<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('studyquest:about', function () {
    $this->info('StudyQuest Laravel API is ready.');
})->purpose('Display a StudyQuest status message');
