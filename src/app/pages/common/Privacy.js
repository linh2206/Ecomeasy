import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Container } from '@material-ui/core';
import { toAbsoluteUrl } from "../../../_metronic/utils/utils"
import { Link } from "react-router-dom";

Privacy.propTypes = {

};

const useStyles = makeStyles({
    root: {

    }
})

function Privacy(props) {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <div className="sticky-header">
                <Container maxWidth="lg">
                    <Link to="/"><img src={toAbsoluteUrl('/media/logos/ece-logo.svg')} /></Link>
                </Container>
            </div>
            <Container maxWidth="lg">
                <div className="information">
                    <p className="information__legend">Privacy</p>
                    <p className="information__title">CHÍNH SÁCH BẢO VỆ<br />
THÔNG TIN CÁ NHÂN CỦA THÀNH VIÊN</p>
                    <ul className="information__level1">
                        <li><span>Mục đích và phạm vi thu thập thông tin khách hàng</span>
                            <ul className="information__level2">
                                <li><span>Mục đích thu thập thông tin:</span>
                                    <ul className="information__level3">
                                        <li><span>
                                            Sử dụng để xác nhận Thành viên khi Thành viên dùng thông tin để đăng nhập vào hệ
                                            thống của ECOMEASY.</span></li>
                                        <li><span>Sử dụng để xác nhận Thành viên khi Thành viên dùng thông tin để đăng nhập vào hệ
                                            thống của ECOMEASY.</span></li>
                                        <li><span>Dùng để giao dịch trong khi mua hàng hóa, dịch của Đối tác trên ECOMEASY như dùng
                                        để đặt dịch vụ, mua hàng hóa, gửi hàng hóa, thanh toán tiền sau khi mua hàng hóa, dịch
                                            vụ....</span></li>
                                        <li><span>ECOMEASY thu thập thông tin Thành viên để quản lý thông tin, phục vụ cho hoạt động
                                        cung cấp mã sản phẩm và hỗ trợ sau mua, để hồi đáp những câu hỏi hay thực hiện các yêu
                                            cầu của Thành viên.</span></li>
                                        <li><span>Dùng trong tuyên truyền quảng cáo các thông tin của ECOMEASY đến các Thành viên
                                            gửi email giới thiệu về các sản phẩm dịch vụ trên ECOMEASY.</span></li>
                                        <li><span>Cung cấp thông tin về dịch vụ bằng email, bưu điện, điện thoại...</span></li>
                                        <li><span>Dùng để cá nhân hóa nội dung mỗi khi Thành viên truy cập vào ECOMEASY, dựa theo
                                            giới tính, tuổi, nơi sinh sống, sở thích, lịch sử mua hàng, trang web Thành viên đã xem.</span></li>
                                        <li><span>Dùng để phân tích xu hướng tiêu dùng của Thành viên, với mục đích xây dựng những
                                            dịch vụ mới, hoặc cải thiện những dịch vụ cũ.</span></li>
                                        <li><span>Dùng để liên lạc với Thành viên khi ECOMEASY điều tra thông tin Thành viên, tổ chức
                                            khuyến mại, trao đổi ý kiến thông tin trên bảng đánh giá, bình luận.</span></li>
                                        <li><span>Dùng để trả lời khi Thành viên thắc mắc: công ty chúng tôi sẽ trả lời Thành viên bằng
                                            email, điện thoại, hoặc gửi thư tới địa chỉ của Thành viên, khi Thành viên thắc mắc.</span></li>
                                        <li><span>Dùng trong các dịch vụ khác do ECOMEASY cung cấp.</span></li>
                                        <li><span>Dùng cung cấp thông tin cá nhân cho Đối tác.</span></li>
                                        <li><span>Dùng cho những mục đích khác của ECOMEASY không ghi ở trên. Khi đó chúng tôi sẽ
thông báo việc sử dụng đó trên ECOMEASY.</span></li>
                                    </ul>
                                </li>
                                <li><span>Phạm vi thu thập thông tin:</span>
                                    <ul className="information__level3">
                                        <li><span>
                                            ECOMEASY tiến hành thu thập các thông tin cá nhân của Thành viên khi Thành viên
                                            đăng ký Thành viên, và các thông tin khác trong quá trình Thành viên phản hồi về chất
lượng sản phẩm, dịch vụ…</span></li>
                                        <li><span>Thông tin của Thành viên cung cấp khi đăng ký : Tên, địa chỉ, điện thoại, địa chỉ email,
số điện thoại di động, ngày tháng năm sinh, giới tính...</span></li>
                                        <li><span>Thông tin nhận được khi Thành viên sử dụng dịch vụ: Thông tin do Thành viên đăng trên
                                        các bảng đánh giá, bình chọn, bình luận về sản phẩm. Thông tin khi các Thành viên trả lời
các bảng điều tra thông tin ECOMEASY đưa ra bằng email, hay trên ECOMEASY.</span></li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li><span>Phạm vi sử dụng thông tin</span>
                            <ul className="information__level3">
                                <li><span>
                                    Thông tin của Thành viên chỉ được sử dụng trong hoạt động quản lý và kinh doanh của
                                    ECOMEASY, cũng như cung cấp cho các bên liên kết. Chúng tôi cũng có thể dùng
                                    những thông tin chúng tôi tập hợp được để thông báo đến Thành viên những sản phẩm
                                    hoặc dịch vụ khác đang có trên ECOMEASY hoặc những công ty liên kết với nó hoặc để
                                    liên hệ với Thành viên để biết quan niệm của Thành viên về những sản phẩm và những

                                    dịch vụ hiện tại hoặc những sản phẩm và dịch vụ mới tiềm năng có thể được đưa ra.
                                    Thông tin cá nhân của Thành viên có thể bị chia sẻ với những công ty khác, nhưng chỉ khi
cần thiết để đáp ứng các yêu cầu của Thành viên hay cho những mục đích liên quan.</span></li>
                                <li><span>Để cung cấp dịch vụ và đủ thông tin đảm bảo cho việc thanh toán, phục vụ hỗ trợ hệ
                                thống chăm sóc Thành viên, quản lý Thành viên, chăm sóc và nhận ý kiến phản hồi từ
phía Thành viên.</span></li>
                            </ul></li>
                        <li><span>Thời gian lưu trữ thông tin</span>
                            <ul className="information__level3">
                                <li><span>
                                    ECOMEASY có hệ thống máy chủ có khả năng lưu trữ thông tin khách hàng tối thiểu là 02
                                    năm và tối đa là 05 năm. Trong quá trình hoạt động, ECOMEASY có thể nâng cao khả
năng lưu trữ thông tin nếu cần thiết.</span></li>
                            </ul></li>
                        <li><span>Những người hoặc tổ chức có thể tiếp cận với các thông tin đó</span>
                            <ul className="information__level3">
                                <li><span>Các nhân viên có thẩm quyền của ECOMEASY. Nhân viên được ủy quyền có thể sử
                                dụng thông tin cá nhân của Thành viên ECOMEASY nhằm mục đích phục vụ kinh
                                doanh. Nhân viên của ECOMEASY bị ràng buộc bởi Chính Sách Bảo Mật của
                                ECOMEASY, đòi hỏi họ phải duy trì tính bảo mật của thông tin cá nhân của Thành viên.
                                Nhân viên nào vi phạm các yêu cầu này có thể bị xử lý kỷ luật, lên đến hình thức chấm
dứt hợp đồng.</span></li>
                                <li><span>Những bên thứ ba muốn cung cấp cho Thành viên Sản Phẩm và Dịch vụ của họ khi
                                Thành viên yêu cầu ECOMEASY thực hiện việc cung cấp thông tin cho những bên thứ
ba này.</span></li>
                                <li><span>Các bên thứ ba hoặc đối tác mà ECOMEASY đã ký hợp đồng để thực hiện dịch vụ thay
                                mặt ECOMEASY, ví dụ như để hoàn thành Sản Phẩm và dịch vụ hoặc cho các mục đích
                                tiếp thị. Tất cả các công ty hoạt động thay mặt cho ECOMEASY đều bắt buộc phải ký kết
                                các cam kết bảo mật các thông tin cá nhân ECOMEASY cung cấp cho họ và sử dụng
                                thông tin cá nhân ECOMEASY chia sẻ chỉ để cung cấp các dịch vụ ECOMEASY yêu
cầu.</span></li>
                                <li><span>Tòa án, cơ quan nhà nước có thẩm quyền khi ECOMEASY được các cơ quan này yêu cầu
cung cấp thông tin của Thành viên.</span></li>
                            </ul></li>
                        <li><span>Địa chỉ của đơn vị thu thập và quản lý thông tin cá nhân:</span><ul className="information__level3">
                            <li><span>Đơn vị thu thập và quản lý thông tin: Công ty TNHH ECOMEASY</span></li>
                            <li><span>Mã số Thuế: 0315191541</span></li>
                            <li><span>Địa chỉ: Tầng 3, 208-210 Khánh Hội, Phường 6, Quận 4, Tp HCM.</span></li>
                        </ul></li>
                        <li><span>Cách thức liên hệ để Thành viên có thể hỏi về hoạt động thu thập, xử lý thông tin
liên quan đến cá nhân mình</span>
                            <p>Thành viên có thể sử dụng các phương thức sau để hỏi về hoạt động thu thập, xử lý thông tin
liên quan đến cá nhân mình:</p>
                            <ul className="information__level3">
                                <li><span>Gửi email tới địa chỉ email: lienhe@ecomeasy.asia; hoặc</span></li>
                                <li><span>Gọi đến số điện thoại 0928625037; hoặc</span></li>
                                <li><span>Gửi thư đến địa chỉ Công ty TNHH ECOMEASY, Địa chỉ: Tầng 3, 208-210 Khánh Hội, Phường 6, Quận 4, Tp HCM.</span></li>
                            </ul>
                        </li>
                        <li><span>Phương thức và công cụ để Thành viên tiếp cận và chỉnh sửa dữ liệu cá nhân của
mình trên hệ thống ECOMEASY</span>
                            <ul className="information__level3">
                                <li><span>Thành viên có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân của
                                mình bằng cách đăng nhập vào tài khoản trên Hệ thống ECOMEASY và chỉnh sửa thông
tin cá nhân hoặc yêu cầu ECOMEASY thực hiện việc này.</span></li>
                                <li><span>Khi tiếp nhận những phản hồi này, ECOMEASY sẽ xác nhận lại thông tin, phải có trách
                                nhiệm trả lời lý do và hướng dẫn Thành viên cập nhật lại thông tin mới hoặc xóa bỏ thông
tin cá nhân Thành viên tùy thao tác của Thành viên.</span></li>
                                <li><span>Việc đăng nhập của Thành viên có thể thực hiện trên máy tính, điện thoại, hay các công
cụ khác có tính năng truy cập vào Ứng dụng ECOMEASY.</span></li>
                            </ul></li>
                        <li><span>Cam kết bảo mật thông tin cá nhân thành viên</span>
                            <ul className="information__level3">
                                <li><span>ECOMEASY không bán thông tin cá nhân của Thành viên với bên thứ ba vì bất cứ lý do
nào.</span></li>
                                <li><span>ECOMEASY chỉ tập hợp lại các thông tin cá nhân trong phạm vi phù hợp và cần thiết
                                cho mục đích thương mại đúng đắn của ECOMEASY. ECOMEASY duy trì các biện
                                pháp thích hợp nhằm bảo đảm tính an toàn, nguyên vẹn, độ chính xác, và tính bảo mật
những thông tin mà Người sử dụng đã cung cấp.</span></li>
                                <li><span>Thông tin cá nhân, thông tin riêng của người sử dụng được thu thập, lưu trữ và bảo vệ
                                một cách nghiêm túc, chính xác và bảo mật. Các thông tin cá nhân, thông tin riêng của
                                người sử dụng sẽ được lưu trữ theo các bước và thực hiện bảo mật nghiêm ngặt theo các
quy định của pháp luật</span></li>
                                <li><span>ECOMEASY đảm bảo an toàn, an ninh cho thông tin cá nhân mà ECOMEASY thu thập
                                và lưu trữ, ngăn ngừa các hành vi sau: Đánh cắp hoặc tiếp cận thông tin trái phép; Sử
dụng thông tin trái phép; Thay đổi, phá hủy thông tin trái phép.</span></li>
                                <li><span>ECOMEASY thiết lập hệ thống bảo vệ thông tin cá nhân người sử dụng qua các hình
                                thức: Thiết lập hệ thống tường lửa ngăn ngừa các hình thức tấn công mạng; Đội ngũ kỹ
                                thuật, nhân viên của ECOMEASY thường xuyên túc trực theo dõi toàn bộ hoạt động của
                                trang mạng. Đảm bảo mọi cuộc tấn công mạng từ các phía đều được phát hiện kịp thời và
thực hiện biện pháp ngăn chặn</span></li>
                                <li><span>Trong trường hợp hệ thống thông tin bị tấn công làm phát sinh nguy cơ mất thông tin của
                                Thành viên, ECOMEASY sẽ thông báo cho cơ quan chức năng trong vòng 24 (hai mươi
bốn) giờ sau khi phát hiện sự cố.</span></li>
                                <li><span>Do không có dịch vụ truyền dữ liệu nào qua Internet được đảm bảo tuyệt đối an toàn vì
                                vậy mặc dù ECOMEASY cố gắng hết sức để bảo vệ thông tin cá nhân của Thành viên,
                                ECOMEASY không thể đảm bảo tính bảo mật tuyệt đối của bất kỳ thông tin mà Thành
viên chuyển tới ECOMEASY.</span></li>
                                <li><span>ECOMEASY và các bên đối tác khác không chịu trách nhiệm về bất kỳ tổn thất nào do
                                những hậu quả trực tiếp, tình cờ hay gián tiếp khi Thành viên truy cập vào ECOMEASY,
                                Thành viên đồng ý chấp nhận mọi rủi ro, bao gồm nhưng không giới hạn, những thất
                                thoát, chi phí (bao gồm chi phí pháp lý, chi phí tư vấn hoặc các khoản chi tiêu khác) có
                                thể phát sinh trực tiếp hoặc gián tiếp do việc truy cập ECOMEASY hoặc khi tải dữ liệu
                                về máy; lỗi phần cứng, lỗi phần mềm, lỗi chương trình, đường truyền dẫn của máy tính
                                hoặc nối kết mạng bị chậm hoặc bất kì các lỗi nào khác mà không do lỗi của
ECOMEASY</span></li>
                                <li><span>Trong trường hợp có vi phạm bảo mật hoặc an toàn thông tin cá nhân của Thành viên,
                                ECOMEASY sẽ thông báo cho Thành viên và trong phạm vi có thể, Thành viên có thể
                                thực hiện các bước bảo vệ thích hợp. ECOMEASY có thể thông báo cho Thành viên
                                những trường hợp nghi ngờ bằng cách sử dụng địa chỉ email mà Thành viên cung cấp cho
ECOMEASY khi Thành viên đăng ký với ECOMEASY.</span></li>
                            </ul></li>
                        <li><span>Cơ chế tiếp cận và giải quyết khiếu nại của Thành viên liên quan đến việc thông tin
cá nhân bị sử dụng sai mục đích hoặc phạm vi đã thông báo</span>
                            <ul className="information__level3">
                                <li><span>Khi phát hiện thông tin cá nhân bị sử dụng sai mục đích hoặc phạm vi mà ECOMEASY
                                đã thông báo, thành viên có thể cung cấp thông tin và chứng cứ liên quan đến việc này
cho ECOMEASY theo có phương thức dưới đây:</span></li>
                                <li><span>Gửi email tới địa chỉ email: lienhe@Ecomeasy.vn; hoặc</span></li>
                                <li><span>Gửi thư đến địa chỉ Công ty TNHH ECOMEASY, địa chỉ: Tầng 3, 208-210 Khánh Hội,
Phường 6, Quận 4, Tp HCM.</span></li>
                                <li><span>Trong thời hạn 15 (mười lăm) ngày kể từ ngày nhận được khiếu nại của thành viên,
                                ECOMEASY trả lời cho thành viên khiếu nại kết quả và phương án giải quyết khiếu nại.
                                Biện pháp giải quyết cụ thể tùy thuộc vào mức độ, tính chất nghiêm trọng của khiếu nại.
                                Nếu Thành viên khiếu nại và ECOMEASY thông thể đạt được thỏa thuận thì một trong
                                hai bên có quyền khiếu nại/khởi kiện với cơ quan nhà nước có thẩm quyền để bảo vệ các
                                quyền và lợi ích hợp pháp của mình. Trường hợp này ECOMEASY sẽ hỗ trợ cung cấp
các thông tin có liên quan.</span></li>
                            </ul></li>
                        <li><span>ECOMEASY sẽ thông báo cho Thành viên về việc Ứng dụng ECOMEASY sẽ thu thập
những thông tin gì trên thiết bị di động khi được cài đặt và sử dụng</span></li>
                        <li><span>ECOMEASY không mặc định buộc Thành viên phải sử dụng các dịch vụ đính kèm khi
cài đặt và sử dụng ứng dụng của mình</span></li>
                        <li><span>Chính sách bảo mật thông tin Thành viên này sẽ được hiển thị rõ ràng cho Thành viên
trước hoặc tại thời điểm ECOMEASY thu thập thông tin.</span></li>
                    </ul>
                </div>
            </Container>
        </div >

    );
}

export default Privacy;