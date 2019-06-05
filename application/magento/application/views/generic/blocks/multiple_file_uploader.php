<?php
$config = self::get_config();
//http://www.jqueryscript.net/other/jQuery-Plugin-For-Multiple-File-Uploader-Upload-File.html
//http://hayageek.com/docs/jquery-upload-file.php#multi
?>

<div id="fileuploader">Upload</div>
<script>
    $(document).ready(function ()
    {

        my_fileuploader_object = $("#fileuploader").uploadFile({
            url: "<?php echo (self::get_path('upload_file')); ?>",
            method: "POST", // Upload Form method type POST or GET.
            enctype: "multipart/form-data", // Upload Form enctype.
            formData: {},
            uploadStr: "",
            dragDropStr: "<span><b>&nbsp;</b></span>",
            deletelStr: "<?php echo(my_pass_through(@self::trace('upload_file_plugin/deletelStr/value'))); ?>",
            allowedTypes: "jpeg,jpg,png,gif",
            fileName: "<?php echo(my_pass_through(@MY_FILE_UPLOADED_VARNAME)); ?>",
            maxFileSize: <?php echo(my_pass_through(@$config['allows']['max_upload_files_size'])); ?>, // Allowed Maximum file Size in bytes.
            maxFileCount: <?php echo(my_pass_through(@$config['allows']['max_upload_files_per_point'])); ?>, // Allowed Maximum number of files to be uploaded
            multiple: true, // If it is set to true, multiple file selection is allowed.
            dragDrop: <?php
if (is_mobile()) {
    echo('false');
} else {
    echo('true');
}
?>, // Drag drop is enabled if it is set to true
            autoSubmit: true,
            showCancel: true,
            showAbort: true,
            showDone: false,
            showDelete: true,
            showError: true,
            showProgress: true,
            nestedForms: true,
            showDownload: false,
            showPreview: true,
            previewWidth: "150px",
            statusBarWidth: 250,
            dragdropWidth: 630,
            showFileCounter: true,
            fileCounterStyle: ". ",
            deleteCallback: function (response) {
                if ($.isFunction(file_uploader_delete)) {
                    file_uploader_delete(response);
                }
            },
            afterUploadAll: function () {

            },
            onSuccess: function (files, response, xhr, pd) {
                if ($.isFunction(file_uploader_success)) {
                    file_uploader_success(response);
                }
                $('#placemark_add_block').append('<br>');
                my_new_point.clear_uploaded_image_from_queue(files);
            },
            onError: function (files, status, errMsg, pd)
            {
                my_new_point.clear_uploaded_image_from_queue(files);
            },
            onCancel: function (files, pd)
            {
                my_new_point.clear_uploaded_image_from_queue(files);
            },
            onSubmit: function (files)
            {
                my_new_point.add_uploaded_image_to_queue(files);
            }
        });
    });
</script>