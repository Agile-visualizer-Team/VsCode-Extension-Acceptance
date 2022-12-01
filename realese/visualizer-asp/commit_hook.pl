#! /usr/bin/perl

# Author: Fiorentino Salvatore
# All fields are optional, to define a commit a pull_request commit is mandatory to write 'pull_request'
# Syntax: git commit -m ".* pull_request({fields})? .*"  
# Example:
# git commit -m"This is a commit pull_request{
#     title=title test:
#     body=body pull request:
#     reviewer=instafiore:
# }"

$regex = 'Author:\s+(?<author_username>\w+)\s+.+\nDate:\s+(?<day>\w+)\s(?<mounth>\w+)\s(?<day_number>\w+)\s(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})\s(?<year>\d{4}).+\n+(?<message>(.|\n)+?)\ndiff';
$regex_inner_message_pull_request = '(((?<=[\s+])pull_request{\n*\s*(?<inner_1>(.|\n)*?)\})|(^pull_request{\n*\s*(?<inner_2>(.|\n)*?)\}))';
$regex_default_pull_request = '((\s+pull_request(?!{))|(^pull_request(?!{)))';

$sha = shift ;
$output_git_log = `git show $sha` ;

if($output_git_log =~ /$regex/gm){

    $author_username = $+{author_username};
    $day = $+{day};
    $mounth = $+{mounth};
    $day_number = $+{day_number};
    $hour = $+{hour};
    $minute = $+{minute};
    $second = $+{second};
    $year = $+{year};
    $message = $+{message};
    
    $title = "$author_username made a pull request";
    $body = "Hey I'm $author_username and I would like to merge my branch to master";
    $delete_branch = 'false' ;
    $reviewer = "";
    
    if($message =~ /$regex_inner_message_pull_request/gm){
        $inner ;
        if($+{inner_1}){
            $inner = $+{inner_1} ;
        }else{
            $inner = $+{inner_2} ;
        }
        
        @split = split(":", $inner);
        for(@split){
            s/^\s+|\s+$//g;
            @map = split("=");
            if($map[0] eq 'title'){
                $title = $map[1];
            }elsif($map[0] eq 'body'){
                $body = $map[1];
            }elsif($map[0] eq 'delete_branch'){
                $delete_branch = $map[1] ;
            }elsif($map[0] eq 'reviewer'){
                $reviewer = $map[1];        
            }
        }
    }elsif(!($message =~ /$regex_default_pull_request/gm)){
        print("pull_request_commit=false\n");
        exit;
    }

    print("title=$title\n");
    print("body=$body\n");
    #print("delete_branch=$delete_branch\n");
    print("reviewer=$reviewer\n");
    print("pull_request_commit=true\n");


}else{
    print("pull_request_commit=false\n");
    exit;
}