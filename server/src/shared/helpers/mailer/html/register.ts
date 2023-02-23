import { mailer } from '../../../../config';
interface infoUserMail {
  userName: string;
  password: string;
  name: string;
}
export const register = ({
  userName,
  password,
  name,
}: infoUserMail): string => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Successful Account Registration</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <!-- Custom CSS -->
    <style>
      .header {
        background-color: #007bff;
        color: #fff;
        padding: 1rem;
        text-align: center;
      }
      .header img {
        max-width: 100%;
        height: auto;
      }
      .content {
        margin-top: 2rem;
      }
      .content img {
        max-width: 100%;
        height: auto;
        margin-top: 2rem;
      }
      .cta {
        background-color: #007bff;
        color: #fff;
        padding: 1rem;
        text-align: center;
        margin-top: 2rem;
      }
      .cta a {
        color: #fff;
        text-decoration: none;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Đăng ký tài khoản thành công</h1>
    </div>
    <div class="container content">
      <p>Dear ${name},</p>
      <p> Tài khoản của bạn đã được đăng ký thành công với các thông tin sau:</p>
      <p><i>Vui lòng không tiết lộ thông tin với bất cứ ai</i></p>
      <ul>
        <li><strong>Tên:</strong> ${name}</li>
        <li><strong>Tài khoản:</strong> ${userName}</li>
        <li><strong>Mật Khẩu:</strong> ${password}</li>
      </ul>
    </div>
    <div class="cta">
      <p>Nhấp vào nút bên dưới để đăng nhập vào tài khoản của bạn:</p>
      <p><a href=${mailer.hostFE} target="_blank">Đăng Nhập</a></p>
    </div>
    
    <!-- jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <!-- Bootstrap JS -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
  </body>
  </html>
  `;
};
